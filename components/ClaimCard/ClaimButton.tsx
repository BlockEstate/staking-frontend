"use client";

import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { StakingPoolContract } from "@/config/contracts";
import { Spinner } from "@/components/Spinner";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useUserRewards } from "@/hooks/useUserRewards";
import { useHasMounted } from "@/hooks/useHasMounted";

function useClaim() {
    const userInfo = useUserInfo()

    const prepare = usePrepareContractWrite({
        ...StakingPoolContract,
        functionName: "claim",
    })

    const action = useContractWrite(prepare.config)

    const wait = useWaitForTransaction({
        hash: action.data?.hash, onSuccess() {
            userInfo.refetch()
        }
    })

    return { prepare, action, wait }
}

export function ClaimButton() {
    const userRewards = useUserRewards()
    const { prepare, action, wait } = useClaim()
    const hasMounted = useHasMounted()


    const amount = userRewards.data?.pendingRewards ?? 0n

    const zeroAmount = amount === 0n

    const preparing = prepare.isLoading || prepare.isError || !action.write
    const sending = action.isLoading || wait.isLoading
    const disabled = !hasMounted || zeroAmount || !userRewards.isSuccess || preparing || sending

    return (
        <button disabled={disabled} onClick={() => action.write?.()} className="btn btn-primary w-full">
            <Spinner enabled={sending} /> {!hasMounted || zeroAmount ? 'No pending rewards' : 'Claim rewards'}
        </button>
    )
}
