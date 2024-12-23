import { useWriteContract, useReadContract, useAccount, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import abi from "@/lib/abi.json"
import { Address } from 'viem';
import { toast } from "sonner";
import { useEffect } from 'react';

export const useContractInteraction = () => {
    const { address, chain, isConnected } = useAccount();
    const { data: hash, writeContract, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isConfirmed) {
            toast.success(`Transaction confirmed successfully! ${hash}`);
        } else if (error) {
            console.log('error', error);
            toast.error(`Error: ${error.message} ${hash}`);
        } else if (isConfirming) {
            toast.info(`Transaction is confirming... ${hash}`);
        }
    }, [isConfirming, isConfirmed, error, hash]);


    const  {data: userProfile} =  useReadContract({
        ...abi,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
        functionName: 'getUser',
        args: [address as Address],
    })

    const createUser = (_dataHash: string) => {
        console.log('createUser', _dataHash);
        return writeContract({
            ...abi,
            address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
            functionName: 'createUser',
            args: [_dataHash]
        });
    };

    // const { data: isVerifiedUser } = useReadContract({
    //     ...OFTADAPTER_CONTRACT_OPTIMISM_SEPOLIA,
    //     functionName: 'getProjectOwnerToId',
    //     args: [address as Address],
    // });

    // const { data: projectId } = useReadContract({
    //     ...ATTESTATIONS_CONTRACT_BASE_SEPOLIA,
    //     functionName: 'getProjectId',
    //     args: [address as Address],
    // });

    // const { data: projectIdCrossChain } = useReadContract({
    //     ...OFTADAPTER_CONTRACT_OPTIMISM_SEPOLIA,
    //     functionName: 'getProjectOwnerToId',
    //     args: [address as Address],
    // });


    // const { data: allowance } = useReadContract({
    //     ...OPTIMISM_SEPOLIA_USDC_CONTRACT,
    //     functionName: 'allowance',
    //     args: [address as Address, OFTADAPTER_CONTRACT_OPTIMISM_SEPOLIA.address],
    // });

    // const { data: lockedTokens } = useReadContract({
    //     ...OFTADAPTER_CONTRACT_OPTIMISM_SEPOLIA,
    //     functionName: 'getAmountLocked',
    //     args: [address as Address],
    // });

    // const { data: projectDetails } = useReadContract({
    //     ...OFTADAPTER_CONTRACT_OPTIMISM_SEPOLIA,
    //     functionName: 'getProjectDetailsByAddress',
    //     args: [address as Address],
    // });

    // const approveUSDC = (amount: bigint) => {
    //     console.log('approveUSDC', amount);
    //     return writeContract({
    //         ...OPTIMISM_SEPOLIA_USDC_CONTRACT,
    //         functionName: 'approve',
    //         args: [OFTADAPTER_CONTRACT_OPTIMISM_SEPOLIA.address, amount],
    //     });
    // };

   

    // const verifyProject = (name: string, description: string, website: string, twitter: string) => {
    //     console.log('verifyProject', name, description, website, twitter);
    //     return writeContract({
    //         ...ATTESTATIONS_CONTRACT_BASE_SEPOLIA,
    //         functionName: 'verifyProject',
    //         args: [name, description, website, twitter],
    //         value: parseEther('0.004'),
    //     });
    // };

    // const queueEqualDistribution = (projectId: string, addresses: Address[], chain: number) => {
    //     console.log('queueEqualDistribution', projectId, addresses, chain);
    //     return writeContract({
    //         ...OFTADAPTER_CONTRACT_OPTIMISM_SEPOLIA,
    //         functionName: 'queueAirdropWithEqualDistribution',
    //         args: [projectId, addresses, chain],
    //     });
    // }

    return {
        userProfile,
        createUser,
        chain,
        address,
        isConnected,
        hash
    };
};