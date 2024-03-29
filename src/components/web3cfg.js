import { WALLET_ADAPTERS } from "@web3auth/base";

export const config = {
  modalConfig: {
    [WALLET_ADAPTERS.OPENLOGIN]: {
      label: "openlogin",
      loginMethods: {
        facebook: {
          showOnModal: false,
        },
        reddit: {
          showOnModal: false,
        },
        discord: {
          showOnModal: false,
        },
        line: {
          showOnModal: false,
        },
        twitch: {
          showOnModal: false,
        },
        apple: {
          showOnModal: false,
        },
        github: {
          showOnModal: false,
        },
        weibo: {
          showOnModal: false,
        },
        wechat: {
          showOnModal: false,
        },
        linkedin: {
          showOnModal: false,
        },
        twitter: {
          showOnModal: false,
        },
        kakao: {
          showOnModal: false,
        },
        farcaster: {
          showOnModal: false,
        },
        google: {
          showOnModal: false,
        },
      },
    },
  },
};
