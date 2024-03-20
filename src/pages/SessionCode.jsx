import { generateUUID } from "three/src/math/MathUtils";
import classnames from "classnames/bind";

import style from "./styles/session.module.scss";
const c = classnames.bind(style);

export default function SessionCode() {
  return (
    <div className={c("session-page")}>
      <div className={c("session-cont")}>{generateUUID()}</div>
    </div>
  );
}
