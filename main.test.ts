import { assertEquals } from "@std/assert";
import { yoga } from "./main.ts";

const testingIds = {seoulBusArrival: 100000025, gyeonggiBusArrival: 222000665, gyeonggiBusRoute: 241348002};

Deno.test("SeoulBusArrival query", async () => {
  const query = `
    query {
      seoulBusArrival(routeIds: [${testingIds.seoulBusArrival}]) {
        response {
          msgBody {
            itemList {
              arrmsg1
              rtNm
              firstTm
              lastTm
              term
              stNm
            }
          }
        }
      }
    }
  `;
  const response = await yoga.fetch("http://yoga/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  const itemList = data.data.seoulBusArrival[0].response.msgBody.itemList;
  const isRtNmIncluded = itemList.some((item: any) => item.rtNm.includes("A01"));
  assertEquals(response.status, 200);
  assertEquals(data.errors, undefined);
  assertEquals(isRtNmIncluded, true);
});

Deno.test("GyeonggiBusArrival query", async () => {
  const query = `
    query {
      gyeonggiBusArrival(stationIds: [${testingIds.gyeonggiBusArrival}]) {
        response {
          msgBody {
            busArrivalList {
              routeName
              predictTime1
              locationNo1
              stationNm1
            }
          }
        }
      }
    }
  `;

  const response = await yoga.fetch("http://yoga/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  const busArrivalList = data.data.gyeonggiBusArrival[0].response.msgBody.busArrivalList;
  const isRouteNameIncluded = busArrivalList.some((item: any) => item.routeName === "2-2A");
  assertEquals(response.status, 200);
  assertEquals(data.errors, undefined);
  assertEquals(isRouteNameIncluded, true);
});

Deno.test("GyeonggiBusRoute query", async () => {
  const query = `
    query {
      gyeonggiBusRoute(routeIds: [${testingIds.gyeonggiBusRoute}]) {
        response {
          msgBody {
            busRouteInfoItem {
              routeName
              upFirstTime
              upLastTime
              peekAlloc
              nPeekAlloc
            }
          }
        }
      }
    }
  `;

  const response = await yoga.fetch("http://yoga/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  const routeName = data.data.gyeonggiBusRoute[0].response.msgBody.busRouteInfoItem.routeName;
  assertEquals(response.status, 200);
  assertEquals(data.errors, undefined);
  assertEquals(routeName, "2-2A");
});
