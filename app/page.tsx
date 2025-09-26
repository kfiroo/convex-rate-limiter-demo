"use client";

import { api } from "@/convex/_generated/api";
import { useRateLimit } from "@convex-dev/rate-limiter/react";
import { useQuery, useMutation } from "convex/react";
import { useState, useCallback, useEffect } from "react";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        <h1 className="px-8 text-2xl font-bold container mx-auto">
          ConvexRate Limiter Demo
        </h1>
      </header>
      <main className="p-8 flex flex-col gap-16 container mx-auto">
        <Bucket />
        <Fixed />
      </main>
    </>
  );
}

interface Orb {
  id: string;
  startTime: number;
}

function Bucket() {
  const { status } = useRateLimit(api.bucket.getRateLimit, {
    // [recommended] Allows the hook to sync the browser and server clocks
    getServerTimeMutation: api.bucket.getServerTime,
    // [optional] The number of tokens to wait on
    count: 1,
  });

  const state = useQuery(api.bucket.getState);
  const limitMutation = useMutation(api.bucket.limit);

  return (
    <Visualizer status={status} state={state} limitMutation={limitMutation} />
  );
}

function Fixed() {
  const { status } = useRateLimit(api.fixed.getRateLimit, {
    getServerTimeMutation: api.fixed.getServerTime,
    count: 1,
  });

  const state = useQuery(api.fixed.getState);
  const limitMutation = useMutation(api.fixed.limit);

  return (
    <Visualizer status={status} state={state} limitMutation={limitMutation} />
  );
}

function Visualizer({
  status,
  state,
  limitMutation,
}: {
  status: ReturnType<typeof useRateLimit>["status"];
  state: unknown;
  limitMutation: () => Promise<{ ok: boolean; retryAfter?: number }>;
}) {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [retryIn, setRetryIn] = useState<number | null>(null);

  useEffect(() => {
    const updateRetryIn = () => {
      if (!status?.retryAt) {
        setRetryIn(null);
        return;
      }
      const timeLeft = status.retryAt - Date.now();

      if (timeLeft > 0) {
        setRetryIn(timeLeft);
        setTimeout(updateRetryIn, 100);
      } else {
        setRetryIn(null);
      }
    };

    if (!status?.ok) {
      setTimeout(updateRetryIn, 100);
    } else {
      setRetryIn(null);
    }
  }, [status?.retryAt, status?.ok]);

  const handleConsume = useCallback(async () => {
    const result = await limitMutation();
    if (!result.ok) {
      return;
    }

    // Create a new orb
    const newOrb: Orb = {
      id: crypto.randomUUID(),
      startTime: Date.now(),
    };

    setOrbs((prev) => [...prev, newOrb]);
  }, [limitMutation]);

  const destroyOrb = useCallback(
    (org: Orb) => {
      setOrbs((prev) => prev.filter((orb) => orb.id !== org.id));
    },
    [setOrbs],
  );

  if (!status) {
    return <div>Loading...</div>;
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 bg-foreground/10 p-4 rounded-lg">
          <div>Status: {status.ok ? "OK" : "Not OK"}</div>
          <div>Retry In: {retryIn ? retryIn + "ms" : ""}</div>
          <div>Orbs: {orbs.length}</div>
        </div>
        <div className="space-y-2 bg-foreground/10 p-4 rounded-lg">
          <div>State:</div>
          <pre className="text-sm">{JSON.stringify(state, null, 2)}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-row gap-4 items-center">
          <button
            onClick={handleConsume}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            Consume
          </button>

          {/* Visualization line */}
          <div className="relative w-full max-w-2xl h-12 bg-foreground/10 overflow-hidden">
            {/* Track line */}
            <Track />
            <SmallTrackDivider className="left-1/10" />
            <SmallTrackDivider className="left-2/10" />
            <SmallTrackDivider className="left-3/10" />
            <SmallTrackDivider className="left-4/10" />
            <BigTrackDivider className="left-5/10" />
            <SmallTrackDivider className="left-6/10" />
            <SmallTrackDivider className="left-7/10" />
            <SmallTrackDivider className="left-8/10" />
            <SmallTrackDivider className="left-9/10" />

            {/* Moving orbs */}
            {orbs.map((orb) => (
              <OrbComponent key={orb.id} orb={orb} destroy={destroyOrb} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Track() {
  return (
    <div className="absolute inset-0 bg-gray-400 h-0.25 top-1/2 -translate-y-1/2"></div>
  );
}

function BigTrackDivider({ className }: { className: string }) {
  return (
    <div
      className={`absolute inset-0 bg-gray-400 w-0.25 h-3/4 -translate-x-1/2 top-1/8 ${className}`}
    ></div>
  );
}

function SmallTrackDivider({ className }: { className: string }) {
  return (
    <div
      className={`absolute inset-0 bg-gray-400 w-0.25 h-1/2 -translate-x-1/2 top-1/4 ${className}`}
    ></div>
  );
}

function OrbComponent({
  orb,
  destroy,
}: {
  orb: Orb;
  destroy: (orb: Orb) => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = orb.startTime;
    const duration = 10000; // 10 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        destroy(orb);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [orb, destroy]);

  return (
    <div
      className="absolute top-1/2 size-10 bg-green-500 rounded-full"
      style={{
        left: `${progress * 100}%`,
        transform: `translate(-50%, -50%)`,
      }}
    />
  );
}
