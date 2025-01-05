import { useState, useEffect } from 'react';
import { getLastSnapsPost } from '../lib/hive/server-functions';
import { get } from 'http';

interface Snap {
    author: string;
    permlink: string;
    // Add other properties as needed
}

const useSnaps = () => {
    const [snaps, setSnaps] = useState<Snap[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    // getCommentsOfFirst10Posts();



    useEffect(() => {
        const fetchSnaps = async () => {
            // console.log('Fetching snaps...');
            const snaps = await getLastSnapsPost();
            console.dir(snaps)
        };
        fetchSnaps();
    }, []);

    return { snaps, loading, error };
};

const fetchAllSnaps = async (lastSnapsPost: Snap): Promise<Snap[]> => {
    // Implement the logic to fetch all snaps based on the last post
    // This is a placeholder function and should be replaced with actual implementation
    return [];
};

export default useSnaps;
