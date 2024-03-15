import publicHTTP from "infra/http/PublicHttpClient";

const BACKEND_BASEURL = "";

/**
 * @typedef {Object} RiddleDto
 * @property {string} riddle - Timestamp date UNIX format.
 * @property {string} answer - Answer to the riddle.
 * @property {string} hint - Hint to show to this riddle.
 * @property {Object<number, string>} bip39Numbers - Numbers to words mapping.
 */

/**
 * @description Client side fetches the riddles from API.
 * @notice No security for demo purposes, answers aren't checked on backend
 * @param {Number?} amount - Riddles to be generated
 * @returns {Array<RiddleDto>}
 */
export async function generateRiddle(amount) {
  const riddles = [
    {
      id: 123,
      riddle: "blahlah",
      answer: "bitter",
      bip39Numbers: { 154: "lion", 165: "tiger", 948: "cow" },
      hint: "free text here just in case",
    },
    {
      id: 123,
      riddle: "blahlah",
      answer: "bitter",
      bip39Numbers: { 154: "lion", 165: "tiger", 948: "cow" },
      hint: "free text here just in case",
    },
    {
      id: 123,
      riddle: "blahlah",
      answer: "bitter",
      bip39Numbers: { 154: "lion", 165: "tiger", 948: "cow" },
      hint: "free text here just in case",
    },
  ];

  try {
    const requestPath = `/riddles/`;
    const fullRequest = new URL(requestPath, BACKEND_BASEURL);
    amount > 0 && fullRequest.searchParams.append("amount", amount);

    const response = await publicHTTP.get(fullRequest);
    Object.assign(riddles, response.data);

    return riddles;
  } catch (error) {
    if (error.response) {
      console.error("RiddlesClient: ", error.response.data);
    } else if (error.request) {
      console.error("RiddlesClient: ", error.request);
    } else {
      console.error("RiddlesClient: ", error.message);
    }
    return riddles;
  }
}
