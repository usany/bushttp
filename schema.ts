export const schema = `    
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
    busArrival(routeId: Int!): String
    seoulBusArrival(routeIds: [Int!]!): [SeoulBusResponse]
    gyeonggiBusArrival(stationIds: [Int!]!): [GyeonggiBusResponse]
    gyeonggiBusRoute(routeIds: [Int!]!): [GyeonggiRouteResponse]
  }
`;
