'use client'
import HiveClient from "@/lib/hive/hiveclient"
import { useCallback, useEffect, useState } from "react"
import { Comment } from "@hiveio/dhive"

interface ActiveVote {
    percent: number;
    reputation: number;
    rshares: number;
    time: string;
    voter: string;
    weight: number;
}
export interface ExtendedComment extends Comment {
    active_votes?: ActiveVote[]
    replies?: ExtendedComment[]
}

interface ActiveVote {
    percent: number
    reputation: number
    rshares: number
    time: string
    voter: string
    weight: number
}

export interface ListCommentsParams {
    start: []
    limit: number
    order: string
}

async function fetchComments(
    author: string,
    permlink: string,
    recursive: boolean = false
): Promise<Comment[]> {
    try {
        /*
        const params = {
            start: [author, permlink, "", ""],
            limit: 10,
            order: "by_parent"
          };
          
        const temp = await HiveClient.call("database_api", "list_comments", params);
        console.log(temp.comments)
        const comments = temp.comments
        */

        const comments = (await HiveClient.database.call("get_content_replies", [
            author,
            permlink,
        ])) as Comment[];

        if (recursive) {
            const fetchReplies = async (comment: ExtendedComment): Promise<ExtendedComment> => {
                if (comment.children && comment.children > 0) {
                    comment.replies = await fetchComments(comment.author, comment.permlink, true);
                }
                return comment;
            };
            const commentsWithReplies = await Promise.all(comments.map(fetchReplies));
            return commentsWithReplies;
        } else {
            return comments;
        }
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return [];
    }
}

export function useComments(
    author: string,
    permlink: string,
    recursive: boolean = false
) {
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAndUpdateComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedComments = await fetchComments(author, permlink, recursive);
            setComments(fetchedComments);
            setIsLoading(false);
        } catch (err: any) {
            setError(err.message ? err.message : "Error loading comments");
            console.error(err);
            setIsLoading(false);
        }
    }, [author, permlink, recursive]);

    useEffect(() => {
        fetchAndUpdateComments();
    }, [fetchAndUpdateComments]);

    const addComment = useCallback((newComment: Comment) => {
        setComments((existingComments) => [...existingComments, newComment]);
    }, []);

    const updateComments = useCallback(async () => {
        await fetchAndUpdateComments();
    }, [fetchAndUpdateComments]);

    return {
        comments,
        error,
        isLoading,
        addComment,
        updateComments,
    };
}
