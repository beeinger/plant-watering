import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FetcherError, Machine } from "types";

import React from "react";
import moment from "moment";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok)
    throw new FetcherError(
      "An error occurred while fetching the data.",
      res.status,
      await res.json()
    );

  return res.json();
};

const requestWatering = (data): Promise<Machine> =>
    fetcher("/api/v1/request-watering").then(async (res) => ({
      ...data,
      ...res,
    })),
  createMachine = async (): Promise<Machine> =>
    fetcher("/api/v1/create-machine");

export default function Index() {
  const { data, mutate, error } = useSWR<Machine>("/api/v1/info", fetcher, {
      refreshInterval: 1000,
    }),
    router = useRouter(),
    [showStartupHistory, setShowStartupHistory] = React.useState(false),
    [showWateringHistory, setShowWateringHistory] = React.useState(false);

  const handleWaterClick = () => {
      //! For now a small password safety so that noone can water my plant
      if (router.query.password === process.env.NEXT_PUBLIC_PASSWORD)
        mutate(requestWatering, {
          optimisticData: { ...data, shouldWater: Date.now() + 5 },
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }).catch((err) => console.error(err.status, err.info));
      else alert("Only I can water my plant :p");
    },
    handleCreateMachineClick = () =>
      mutate(createMachine, {
        optimisticData: {
          key: "0",
          lastPing: null,
          shouldWater: false,
          startupHistory: [],
          wateringHistory: [],
        },
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }).catch((err) => console.error(err.status, err.info));

  return (
    <div>
      {data === null ? (
        <>
          {error && <div>Error: {error.info?.message || error.message}</div>}
          <button onClick={handleCreateMachineClick}>Create a machine</button>
        </>
      ) : (
        <>
          <div>Machine id: {data?.key}</div>
          {data?.shouldWater && (
            <div>
              Watering in progress, requested{" "}
              {moment(data.shouldWater).toString()}
            </div>
          )}
          <div>
            Last ping:{" "}
            {data?.lastPing
              ? moment(data?.lastPing).toString()
              : "No pings yet"}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => setShowStartupHistory((prev) => !prev)}
          >
            Machine started up {data?.startupHistory.length} times{" "}
            {showStartupHistory ? <AiFillCaretUp /> : <AiFillCaretDown />}
          </div>
          {showStartupHistory && (
            <div style={{ marginLeft: "16px" }}>
              {data?.startupHistory.map((startup) => (
                <div key={startup}>{moment(startup).toString()}</div>
              ))}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => setShowWateringHistory((prev) => !prev)}
          >
            Machine watered the plant {data?.wateringHistory.length} times{" "}
            {showWateringHistory ? <AiFillCaretUp /> : <AiFillCaretDown />}
          </div>
          {showWateringHistory ? (
            <div style={{ marginLeft: "16px" }}>
              {data?.wateringHistory.map((watering) => (
                <div key={watering.requestedAt}>
                  <div>Requested {moment(watering.requestedAt).toString()}</div>
                  <div>Started {moment(watering.startedAt).toString()}</div>
                </div>
              ))}
            </div>
          ) : null}
          {error && <div>Error: {error.info?.message || error.message}</div>}
          <button onClick={handleWaterClick}>Water</button>
        </>
      )}
    </div>
  );
}
