// import { createIdentifyEvent } from '@core/events/createIdentifyEvent.js'
// import { Identify } from '@core/identify.js'
// import { BASE_CAMPAIGN } from '@core/campaign/constants.js'
// import { Campaign, Options } from '@airblock-sdk/types'

// export const createCampaignEvent = (campaign: Campaign, options: Options) => {
//   const campaignParameters: Campaign = {
//     // This object definition allows undefined keys to be iterated on
//     // in .reduce() to build indentify object
//     ...BASE_CAMPAIGN,
//     ...campaign
//   }
//   const identifyEvent = Object.entries(campaignParameters).reduce(
//     (identify, [key, value]) => {
//       // identify.setOnce(
//       //   `initial_${key}`,
//       //   value ?? options.initialEmptyValue ?? 'EMPTY'
//       // )
//       if (value) {
//         return identify.set(key, value)
//       }
//       return identify.unset(key)
//     },
//     new Identify()
//   )

//   return createIdentifyEvent(identifyEvent)
// }
