import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import Tweet from './Tweet';
import { ExtendedComment, useComments } from '@/hooks/useComments';
import { useSnaps } from '@/hooks/useSnaps';
import TweetComposer from './TweetComposer';

interface TweetListProps {
  author: string
  permlink: string
  setConversation: (conversation: ExtendedComment) => void;
  onOpen: () => void;
  setReply: (reply: ExtendedComment) => void;
  newComment: ExtendedComment | null;
  post?: boolean;
}

function handleNewComment() {

}

export default function TweetList({
  author,
  permlink,
  setConversation,
  onOpen,
  setReply,
  newComment,
  post = false,
}: TweetListProps) {

  const snaps = useSnaps();
  const commentsData = useComments(author, permlink, post);

  // Decide which data to use
  const isSnaps = permlink === 'snaps';
  const comments = isSnaps ? snaps.comments : commentsData.comments;
  const loadNextPage = isSnaps ? snaps.loadNextPage : () => {};
  const isLoading = isSnaps ? snaps.isLoading : commentsData.isLoading;
  const hasMore = isSnaps ? snaps.hasMore : false;

  comments.sort((a: ExtendedComment, b: ExtendedComment) => {
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });
  // Handle new comment addition
  //const updatedComments = newComment ? [newComment, ...comments] : comments;

  console.log('here', comments)

  if (isLoading && comments.length === 0) {
    // Initial loading state
    return (
      <Box textAlign="center" mt={4}>
        <Spinner size="xl" />
        <Text>Loading posts...</Text>
      </Box>
    );
  }

  return (
        <InfiniteScroll
            dataLength={comments.length}
            next={loadNextPage}
            hasMore={hasMore}
            loader={
                (<Box display="flex" justifyContent="center" alignItems="center" py={5}>
                    <Spinner size="xl" color="primary" />
                </Box>
                )}
            scrollableTarget="scrollableDiv"
            style={{ padding: 15 }}
        >
        <VStack spacing={2} align="stretch" mx="auto">
        <TweetComposer pa={author} pp={permlink} onNewComment={handleNewComment} />
          {comments.map((comment: ExtendedComment) => (
            <Tweet
              key={comment.permlink}
              comment={comment}
              onOpen={onOpen}
              setReply={setReply}
              {...(!post ? { setConversation } : {})}
            />
          ))}
        </VStack>
      </InfiniteScroll>
  );
}
