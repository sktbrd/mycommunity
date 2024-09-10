import { Box, Text, Avatar, Flex, Icon, Button, Link, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Discussion } from '@hiveio/dhive';
import { FaHeart, FaComment, FaRegHeart } from 'react-icons/fa';
import { getPostDate } from '@/lib/utils/GetPostDate';
import { useAioha } from '@aioha/react-ui';
import { MarkdownRenderer } from '../MarkdownRenderer';

interface PostDetailsProps {
    post: Discussion;
}

export default function PostDetails({ post }: PostDetailsProps) {
    const { title, author, body, created } = post;
    const postDate = getPostDate(created);
    const { aioha, user } = useAioha();
    const [sliderValue, setSliderValue] = useState(100);
    const [showSlider, setShowSlider] = useState(false);
    const [voted, setVoted] = useState(post.active_votes?.some(item => item.voter === user));

    function handleHeartClick() {
        setShowSlider(!showSlider);
    }

    async function handleVote() {
        const vote = await aioha.vote(post.author, post.permlink, sliderValue * 100);
        setVoted(vote.success);
        handleHeartClick();
    }

    return (
        <Box borderWidth="1px" borderRadius="base" overflow="hidden" bg="muted" mb={3} p={4} w="100%">
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                {title}
            </Text>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Flex alignItems="center">
                    <Avatar size="sm" name={author} src={`https://images.hive.blog/u/${author}/avatar/sm`} />
                    <Box ml={3}>
                        <Text fontWeight="medium" fontSize="sm">
                            <Link href={`/author/${author}`}>@{author}</Link>
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            {postDate}
                        </Text>
                    </Box>
                </Flex>
            </Flex>
            <Box mt={4}>
                <MarkdownRenderer>{body}</MarkdownRenderer>
            </Box>
            {showSlider ? (
                <Flex mt={4} alignItems="center">
                    <Box width="100%" mr={2}>
                        <Slider
                            aria-label="slider-ex-1"
                            min={0}
                            max={100}
                            value={sliderValue}
                            onChange={(val) => setSliderValue(val)}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box>
                    <Button size="xs" onClick={handleVote}>&nbsp;&nbsp;&nbsp;Vote {sliderValue} %&nbsp;&nbsp;&nbsp;</Button>
                    <Button size="xs" onClick={handleHeartClick} ml={2}>X</Button>

                </Flex>
            ) : (
                <Flex mt={4} justifyContent="space-between" alignItems="center">
                    <Flex alignItems="center">
                        {voted ? (
                            <Icon as={FaHeart} onClick={handleHeartClick} cursor="pointer" />
                        ) : (
                            <Icon as={FaRegHeart} onClick={handleHeartClick} cursor="pointer" />
                        )}
                        
                        <Text ml={2} fontSize="sm">{post.active_votes.length}</Text>
                        <Icon as={FaComment} ml={4} />
                        <Text ml={2} fontSize="sm">{post.children}</Text>
                    </Flex>
                    <Text fontWeight="bold" fontSize="sm">
                        ${String(post.pending_payout_value).replace(" HBD", "")}
                    </Text>
                </Flex>
            )}
        </Box>
    );
}