'use client';

import { Box, Container, Flex } from '@chakra-ui/react';
import TweetList from '@/components/homepage/TweetList';
import TweetComposer from '@/components/homepage/TweetComposer';
import RightSidebar from '@/components/layout/RightSideBar';
import { useState } from 'react';
import { Comment } from '@hiveio/dhive'; // Ensure this import is consistent
import Conversation from '@/components/homepage/Conversation';
import TweetReplyModal from '@/components/homepage/TweetReplyModal';

export default function Home() {
  console.log('author', process.env.NEXT_PUBLIC_THREAD_AUTHOR);
  const thread_author = process.env.NEXT_PUBLIC_THREAD_AUTHOR || 'skatedev';
  const thread_permlink = process.env.NEXT_PUBLIC_THREAD_PERMLINK || 're-skatedev-sidr6t';

  const [conversation, setConversation] = useState<Comment | undefined>();
  const [reply, setReply] = useState<Comment>();
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState<Comment | null>(null); // Define the state

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleNewComment = (newComment: Partial<Comment> | CharacterData) => {
    setNewComment(newComment as Comment);
  };

  return (
    <Flex direction={{ base: 'column', md: 'row' }}>
      <Container
        maxW={{ base: '100%', md: '720px' }}
        h="100vh"
        overflowY="auto"
        pr={2}
        pt={2}
        position={"sticky"}
        top={0}
        justifyContent="center"
        flex="1"
        sx={
          {
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }
        }
        id='scrollableDiv'>
        {!conversation ? (


          <TweetList
            setConversation={setConversation}
            onOpen={onOpen}
            setReply={setReply}
            newComment={newComment}
          />
        ) : (
          <Conversation comment={conversation} setConversation={setConversation} onOpen={onOpen} setReply={setReply} />
        )}
      </Container>
      <RightSidebar />
      {isOpen && <TweetReplyModal isOpen={isOpen} onClose={onClose} comment={reply} onNewReply={handleNewComment} />}
    </Flex>
  );
}
