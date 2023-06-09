"use client";

import { formatk } from "@/utils";
import { usePoolInfo } from "@/hooks/usePoolInfo";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useHasMounted } from "@/hooks/useHasMounted";

export function PoolTotalStaked() {
    const poolInfo = usePoolInfo()
    const tokenInfo = useTokenInfo()
    const hasMounted = useHasMounted()

    const loaded = hasMounted && tokenInfo.isSuccess && poolInfo.isSuccess

    const decimals = tokenInfo.data?.staking.decimals ?? 0
    const amount = poolInfo.data?.totalStaked ?? 0n

    return (
        <span>
            {loaded ? formatk(amount, decimals) : '-'}
        </span>
    )
}
