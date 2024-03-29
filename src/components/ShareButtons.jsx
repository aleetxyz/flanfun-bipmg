import { useEffect, useState } from "react";
import { ShareSocial } from "react-share-social";
import classNames from "classnames";

const c = classNames.bind({});

export default function ShareButtons(props) {
  const { uuid } = props;
  const [url, setURL] = useState();

  useEffect(() => {
    setURL(`${window.location.href}${uuid}`);
  }, [uuid]);

  return (
    <div className={c("row", "share-wrap")}>
      <ShareSocial
        url={url}
        socialTypes={["email", "facebook", "twitter", "telegram", "whatsapp"]}
      />
    </div>
  );
}
