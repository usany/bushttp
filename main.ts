import { createSchema, createYoga } from 'graphql-yoga'
import xmlToJson from './xmlToJson.ts'

const schema = `    
  type GyeonggiBusRouteInfo {
    routeName: String
    upFirstTime: String
    upLastTime: String
    peekAlloc: String
    nPeekAlloc: String
    satPeekAlloc: String
    satNPeekAlloc: String
    sunPeekAlloc: String
    sunNPeekAlloc: String
    wePeekAlloc: String
    weNPeekAlloc: String
  }

  type SeoulBusResponse {
    response: SeoulResponse
  }
  type SeoulResponse {
    msgBody: SeoulMsgBody
  }
  type SeoulMsgBody {
    itemList: [SeoulBusArrivalInfo]
  }
  type SeoulBusArrivalInfo {
    arrmsg1: String
    rtNm: String
    firstTm: String
    lastTm: String
    term: String
    stNm: String
  }

  type GyeonggiBusResponse {
    response: GyeonggiResponse
  }
  type GyeonggiResponse {
    msgBody: GyeonggiBody
  }
  type GyeonggiBody {
    busArrivalList: [GyeonggiBusArrivalInfo]
  }  
  type GyeonggiBusArrivalInfo {
    routeName: String
    predictTime1: String
    locationNo1: String
    stationNm1: String
  }

  type GyeonggiRouteResponse {
    response: GyeonggiRouteResponseData
  }
  type GyeonggiRouteResponseData {
    msgBody: GyeonggiRouteBody
  }
  type GyeonggiRouteBody {
    busRouteInfoItem: GyeonggiBusRouteInfo
  }
  type GyeonggiBusRouteInfo {
    routeName: String
    upFirstTime: String
    upLastTime: String
    peekAlloc: String
    nPeekAlloc: String
    satPeekAlloc: String
    satNPeekAlloc: String
    sunPeekAlloc: String
    sunNPeekAlloc: String
    wePeekAlloc: String
    weNPeekAlloc: String
  }

  type Query {
    hello: String
    seoulBusArrival(routeIds: [Int!]!): [SeoulBusResponse]
    gyeonggiBusArrival(stationIds: [Int!]!): [GyeonggiBusResponse]
    gyeonggiBusRoute(routeIds: [Int!]!): [GyeonggiRouteResponse]
    busArrival(routeId: Int!): String
  }
`;
const root = {  
  seoulBusArrival: async (_: any, { routeIds }) => {
    try {
      const apiKey = Deno.env.get("USERID");
      const results = [];
      
      for (const routeId of routeIds) {
        const url = `http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll?serviceKey=${apiKey}&busRouteId=${routeId}`;
        const response = await fetch(url);
        const xmlData = await response.text();
        const jsonData = xmlToJson(xmlData);
        results.push({
          response: {
            msgBody: {
              itemList: jsonData.msgBody?.itemList?.map(item => {
                return ({
                arrmsg1: item.arrmsg1 || '',
                rtNm: item.rtNm || '',
                firstTm: item.firstTm || '',
                lastTm: item.lastTm || '',
                term: item.term || '',
                stNm: item.stNm || ''
              })}) || []
            }
          }
        });
      }
      return results;
    } catch (error) {
      console.error('Error fetching Seoul bus data:', error);
      return {
        response: {
          msgHeader: {
            headerCd: 'ERROR',
            headerMsg: 'Error fetching Seoul bus data',
            itemCount: '0'
          },
          msgBody: {
            itemList: []
          }
        }
      };
    }
  },

  gyeonggiBusArrival: async (_: any, { stationIds }) => {
    try {
      const apiKey = Deno.env.get("USERID");
      const results = [];
      
      for (const stationId of stationIds) {
        const url = `https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${apiKey}&stationId=${stationId}&format=json`;
        const data = await fetch(url);
        const res = await data.json();
        results.push(res);
      }
      return results;
    } catch (error) {
      console.error('Error fetching Gyeonggi bus arrival data:', error);
      return stationIds.map(() => ({
        response: {
          header: {
            resultCode: 'ERROR',
            resultMsg: 'Error fetching Gyeonggi bus arrival data'
          },
          body: {
            items: {
              item: []
            }
          }
        }
      }));
    }
  },

  gyeonggiBusRoute: async (_: any, { routeIds }) => {
    try {
      const apiKey = Deno.env.get("USERID");
      const results = []
      for (const routeId of routeIds) {
        const url = `https://apis.data.go.kr/6410000/busrouteservice/v2/getBusRouteInfoItemv2?serviceKey=${apiKey}&routeId=${routeId}&format=json`;
        const response = await fetch(url);
        const apiData = await response.json();
        results.push(apiData)
        console.log(apiData)
      }
      return results
    } catch (error) {
      console.error('Error fetching Gyeonggi bus route data:', error);
      return {
        response: {
          msgHeader: {
            resultCode: 'ERROR',
            resultMsg: 'Error fetching Gyeonggi bus route data'
          },
          msgBody: {
            busRouteInfoItem: []
          }
        }
      };
    }
  },
};

// Create GraphQL Yoga instance
const yoga = createYoga({
  schema: createSchema({
    typeDefs: schema,
    resolvers: {
      Query: {
        ...root,
      },
    },
  }),
  graphqlEndpoint: '/graphql'
})
 
Deno.serve({
  port: 5000,
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}${yoga.graphqlEndpoint}`)
  }
}, yoga)
