import Slider from "react-slick";
import classnames from "classnames/bind";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./slider.module.scss";
const c = classnames.bind(styles);

export default function BIP39WordSlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1333,
    pauseOnHover: false,
  };

  const renderItem = () => {};

  return (
    <div className={c("timeline")}>
      <Slider {...settings}>
        <div className={c("timeline-itm")}>
          <div className={c("segment-wrap")} onClick={renderItem}>
            <div className={c("segment-disp")}>
              <p className={c("segment-14")}>1024</p>
            </div>
          </div>
        </div>
        <div className={c("timeline-itm")}>
          <div className={c("segment-wrap")} onClick={renderItem}>
            <div className={c("segment-disp")}>
              <p className={c("segment-14")}>2048</p>
            </div>
          </div>
        </div>
        <div className={c("timeline-itm")}>
          <div className={c("segment-wrap")} onClick={renderItem}>
            <div className={c("segment-disp")}>
              <p className={c("segment-14")}>3072</p>
            </div>
          </div>
        </div>
        <div className={c("timeline-itm")}>
          <div className={c("segment-wrap")} onClick={renderItem}>
            <div className={c("segment-disp")}>
              <p className={c("segment-14")}>4096</p>
            </div>
          </div>
        </div>
        <div className={c("timeline-itm")}>
          <div className={c("segment-wrap")} onClick={renderItem}>
            <div className={c("segment-disp")}>
              <p className={c("segment-14")}>5120</p>
            </div>
          </div>
        </div>
        <div className={c("timeline-itm")}>
          <div className={c("segment-wrap")} onClick={renderItem}>
            <div className={c("segment-disp")}>
              <p className={c("segment-14")}>6144</p>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
}
