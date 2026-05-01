import xmlToJson from './xmlToJson.ts'

export const resolvers = {  
  seoulBusArrival: async (_: any, { routeIds }: { routeIds: string[] }) => {
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

  gyeonggiBusArrival: async (_: any, { stationIds }: { stationIds: string[] }) => {
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

  gyeonggiBusRoute: async (_: any, { routeIds }: { routeIds: string[] }) => {
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
