import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST /api/governance/proposals/[id]/vote - Vote on a proposal
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: proposalId } = await params;
    const sessionUser = await getCurrentUser();

    if (!sessionUser || !sessionUser.dbUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = sessionUser.dbUser.id;
    const body = await request.json();
    const { vote } = body; // FOR, AGAINST, ABSTAIN

    if (!vote || !['FOR', 'AGAINST', 'ABSTAIN'].includes(vote.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid vote. Must be FOR, AGAINST, or ABSTAIN' },
        { status: 400 }
      );
    }

    // Check if proposal exists and is active
    const proposal = await db.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    if ((proposal as any)?.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Proposal is not active' },
        { status: 400 }
      );
    }

    if (new Date() > (proposal as any)?.endDate) {
      return NextResponse.json(
        { error: 'Voting has ended' },
        { status: 400 }
      );
    }

    // Get user's voting power (based on level and achievements)
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Voting power based on level (1 vote per level)
    const votingPower = Math.max(1, (user as any)?.level || 1);

    // Check if already voted
    const existingVote = await db.vote.findUnique({
      where: {
        userId_proposalId: { userId, proposalId },
      },
    });

    if (existingVote) {
      // Update existing vote
      const oldVoteType = (existingVote as any)?.vote;
      const oldVotingPower = (existingVote as any)?.votingPower;

      // Update vote
      await db.vote.update({
        where: { id: (existingVote as any)?.id },
        data: {
          vote: vote.toUpperCase(),
          votingPower,
        },
      });

      // Update proposal vote counts
      const updateData: Record<string, { increment?: number; decrement?: number }> = {};
      
      // Remove old vote
      if (oldVoteType === 'FOR') {
        updateData.votesFor = { decrement: oldVotingPower };
      } else if (oldVoteType === 'AGAINST') {
        updateData.votesAgainst = { decrement: oldVotingPower };
      }

      // Add new vote
      if (vote.toUpperCase() === 'FOR') {
        updateData.votesFor = { ...updateData.votesFor, increment: votingPower };
      } else if (vote.toUpperCase() === 'AGAINST') {
        updateData.votesAgainst = { ...updateData.votesAgainst, increment: votingPower };
      }

      await db.proposal.update({
        where: { id: proposalId },
        data: updateData,
      });

      return NextResponse.json({
        success: true,
        message: 'Vote updated',
        votingPower,
      });
    }

    // Create new vote
    await db.vote.create({
      data: {
        userId,
        proposalId,
        vote: vote.toUpperCase(),
        votingPower,
      },
    });

    // Update proposal vote counts
    const updateData: Record<string, { increment: number }> = {};
    if (vote.toUpperCase() === 'FOR') {
      updateData.votesFor = { increment: votingPower };
    } else if (vote.toUpperCase() === 'AGAINST') {
      updateData.votesAgainst = { increment: votingPower };
    }

    const updatedProposal = await db.proposal.update({
      where: { id: proposalId },
      data: updateData,
    });

    // Check if quorum reached and proposal should pass/fail
    const totalVotes = updatedProposal.votesFor + updatedProposal.votesAgainst;
    if (totalVotes >= updatedProposal.quorum) {
      const passed = updatedProposal.votesFor > updatedProposal.votesAgainst;
      await db.proposal.update({
        where: { id: proposalId },
        data: {
          status: passed ? 'PASSED' : 'REJECTED',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Vote recorded',
      votingPower,
    }, { status: 201 });
  } catch (error) {
    console.error('Error voting on proposal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

