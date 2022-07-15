import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import {
  Learn_more,
  CloseBtn,
  Learn_more_m,
  CloseBtn_white,
  CircleCloseBtn,
} from '~components/icon/Common';
import {
  PopupBox1,
  PopupBox2,
  PopupBox3,
  PopupBox4,
  PopupText,
  PopupBox1Mobile,
} from '~components/icon/Xref';
import { IncentivePopup, LoveIcon, CloseButton } from '~components/icon/Farm';
import { ModalCloseAuto } from '~components/icon';
import { isMobile } from '~utils/device';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import SwiperCore, { Autoplay } from 'swiper';
SwiperCore.use([Autoplay]);

export default function PopUpSwiper() {
  const [closeStatus, setCloseStatus] = useState(true);
  const history = useHistory();
  useEffect(() => {
    const popupSwiper = localStorage.getItem('popup-migrate');
    if (popupSwiper == '1') {
      setCloseStatus(true);
    } else {
      setCloseStatus(false);
    }
  }, []);
  const closePop = (e: any) => {
    localStorage.setItem('popup-migrate', '1');
    e.stopPropagation();
    setCloseStatus(true);
  };
  const mobile = isMobile();
  return (
    <>
      {closeStatus ? null : (
        <div
          className={`fixed xs:left-1/2 xs:transform xs:-translate-x-1/2 md:left-1/2 md:transform md:-translate-x-1/2 z-50 lg:right-8 ${
            mobile ? 'farmPopupBoxMobile' : 'farmPopupBox'
          }`}
        >
          <Swiper
            // spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={false}
          >
            <SwiperSlide>
              <div className="relative pt-9">
                <div
                  onClick={closePop}
                  className="flex justify-end items-center absolute top-0 right-0 cursor-pointer w-8 h-8"
                >
                  <CircleCloseBtn></CircleCloseBtn>
                </div>
                {/*  <FarmsMigrateBg
                  className="cursor-pointer"
                  onClick={() => {
                    window.open('/farmsBoost');
                  }}
                ></FarmsMigrateBg> */}
                {/* <div
                  onClick={closePop}
                  className="flex justify-end items-center absolute top-0 right-0 cursor-pointer w-8 h-8"
                >
                  <CircleCloseBtn></CircleCloseBtn>
                </div>
                <video
                  controlsList="nodownload"
                  src={
                    '//video-qn.51miz.com/preview/video/00/00/15/34/V-153443-511735E3.mp4'
                  }
                  preload="metadata"
                  controls
                ></video> */}
                <iframe
                  width="350"
                  height="196"
                  src="https://www.youtube.com/embed/NEwv8WwRdM0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      )}
    </>
  );
}
function FarmsMigrateBg(props: any) {
  return (
    <svg
      {...props}
      width="289"
      height="145"
      viewBox="0 0 289 145"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M289 16C289 7.16344 281.837 0 273 0H37C28.1634 0 21 7.16344 21 16V129C21 137.837 28.1634 145 37 145H273C281.837 145 289 137.837 289 129V16Z"
        fill="url(#paint0_linear_1543_44)"
      />
      <path
        d="M139.815 24V10H136.775V18.62L130.215 10H127.375V24H130.415V15.1L137.195 24H139.815ZM152.856 18.94V18.9C152.856 15.86 151.216 13.08 147.636 13.08C144.516 13.08 142.336 15.6 142.336 18.66V18.7C142.336 21.98 144.716 24.24 147.936 24.24C149.876 24.24 151.316 23.48 152.316 22.24L150.576 20.7C149.736 21.48 148.996 21.8 147.976 21.8C146.616 21.8 145.656 21.08 145.356 19.7H152.816C152.836 19.42 152.856 19.24 152.856 18.94ZM149.896 17.8H145.316C145.556 16.42 146.376 15.52 147.636 15.52C148.916 15.52 149.716 16.44 149.896 17.8ZM169.994 13.28H166.974L165.214 19.8L163.174 13.24H160.554L158.534 19.78L156.814 13.28H153.734L157.034 24.08H159.754L161.854 17.5L163.914 24.08H166.654L169.994 13.28ZM188.077 13.28H184.917L182.497 20.46L180.097 13.28H176.877L181.097 24.08H183.857L188.077 13.28ZM199.223 18.94V18.9C199.223 15.86 197.583 13.08 194.003 13.08C190.883 13.08 188.703 15.6 188.703 18.66V18.7C188.703 21.98 191.083 24.24 194.303 24.24C196.243 24.24 197.683 23.48 198.683 22.24L196.943 20.7C196.103 21.48 195.363 21.8 194.343 21.8C192.983 21.8 192.023 21.08 191.723 19.7H199.183C199.203 19.42 199.223 19.24 199.223 18.94ZM196.263 17.8H191.683C191.923 16.42 192.743 15.52 194.003 15.52C195.283 15.52 196.083 16.44 196.263 17.8ZM207.949 16.26V13.08C206.149 13 205.149 13.96 204.529 15.44V13.28H201.489V24H204.529V20.04C204.529 17.48 205.769 16.26 207.789 16.26H207.949ZM217.708 20.74V20.7C217.708 18.74 215.968 18.02 214.468 17.52C213.308 17.12 212.288 16.84 212.288 16.24V16.2C212.288 15.78 212.668 15.46 213.408 15.46C214.188 15.46 215.248 15.84 216.308 16.46L217.468 14.36C216.308 13.58 214.828 13.12 213.468 13.12C211.308 13.12 209.548 14.34 209.548 16.52V16.56C209.548 18.64 211.248 19.34 212.748 19.78C213.928 20.14 214.968 20.36 214.968 21.02V21.06C214.968 21.54 214.568 21.86 213.688 21.86C212.688 21.86 211.468 21.42 210.308 20.58L209.008 22.58C210.428 23.7 212.108 24.2 213.608 24.2C215.928 24.2 217.708 23.12 217.708 20.74ZM223.147 12.1V9.4H219.947V12.1H223.147ZM223.067 24V13.28H220.027V24H223.067ZM237.003 18.66V18.62C237.003 15.54 234.543 13.08 231.223 13.08C227.883 13.08 225.403 15.58 225.403 18.66V18.7C225.403 21.78 227.863 24.24 231.183 24.24C234.523 24.24 237.003 21.74 237.003 18.66ZM234.003 18.7C234.003 20.28 232.963 21.62 231.223 21.62C229.543 21.62 228.403 20.24 228.403 18.66V18.62C228.403 17.04 229.443 15.7 231.183 15.7C232.863 15.7 234.003 17.08 234.003 18.66V18.7ZM249.024 24V17.06C249.024 14.6 247.684 13.08 245.384 13.08C243.844 13.08 242.944 13.9 242.244 14.8V13.28H239.204V24H242.244V18.02C242.244 16.58 242.984 15.84 244.144 15.84C245.304 15.84 245.984 16.58 245.984 18.02V24H249.024ZM122.791 33.8V31H112.131V45H115.211V39.58H121.891V36.78H115.211V33.8H122.791ZM133.648 45V38.78C133.648 35.88 132.188 34.16 128.868 34.16C127.048 34.16 125.888 34.5 124.708 35.02L125.468 37.34C126.448 36.98 127.268 36.76 128.428 36.76C129.948 36.76 130.728 37.46 130.728 38.72V38.9C129.968 38.64 129.188 38.46 128.108 38.46C125.568 38.46 123.788 39.54 123.788 41.88V41.92C123.788 44.04 125.448 45.2 127.468 45.2C128.948 45.2 129.968 44.66 130.708 43.84V45H133.648ZM130.768 41.22C130.768 42.32 129.808 43.1 128.388 43.1C127.408 43.1 126.728 42.62 126.728 41.8V41.76C126.728 40.8 127.528 40.28 128.828 40.28C129.568 40.28 130.248 40.44 130.768 40.68V41.22ZM142.724 37.26V34.08C140.924 34 139.924 34.96 139.304 36.44V34.28H136.264V45H139.304V41.04C139.304 38.48 140.544 37.26 142.564 37.26H142.724ZM160.984 45V38.02C160.984 35.44 159.624 34.08 157.364 34.08C155.904 34.08 154.784 34.68 153.844 35.78C153.284 34.7 152.224 34.08 150.824 34.08C149.284 34.08 148.364 34.9 147.664 35.8V34.28H144.624V45H147.664V39.02C147.664 37.58 148.364 36.84 149.504 36.84C150.644 36.84 151.284 37.58 151.284 39.02V45H154.324V39.02C154.324 37.58 155.024 36.84 156.164 36.84C157.304 36.84 157.944 37.58 157.944 39.02V45H160.984ZM180.404 42.58V34.28H177.364V35.68C176.544 34.78 175.564 34.08 173.904 34.08C171.444 34.08 169.144 35.88 169.144 39.08V39.12C169.144 42.3 171.404 44.12 173.904 44.12C175.524 44.12 176.504 43.46 177.404 42.38V42.9C177.404 44.82 176.424 45.82 174.344 45.82C172.924 45.82 171.824 45.46 170.724 44.84L169.684 47.12C171.044 47.84 172.684 48.24 174.424 48.24C178.404 48.24 180.404 46.62 180.404 42.58ZM177.404 39.12C177.404 40.58 176.264 41.6 174.784 41.6C173.304 41.6 172.184 40.6 172.184 39.12V39.08C172.184 37.62 173.304 36.6 174.784 36.6C176.264 36.6 177.404 37.62 177.404 39.08V39.12ZM194.2 39.66V39.62C194.2 36.54 191.74 34.08 188.42 34.08C185.08 34.08 182.6 36.58 182.6 39.66V39.7C182.6 42.78 185.06 45.24 188.38 45.24C191.72 45.24 194.2 42.74 194.2 39.66ZM191.2 39.7C191.2 41.28 190.16 42.62 188.42 42.62C186.74 42.62 185.6 41.24 185.6 39.66V39.62C185.6 38.04 186.64 36.7 188.38 36.7C190.06 36.7 191.2 38.08 191.2 39.66V39.7ZM206.401 39.94V39.9C206.401 36.86 204.761 34.08 201.181 34.08C198.061 34.08 195.881 36.6 195.881 39.66V39.7C195.881 42.98 198.261 45.24 201.481 45.24C203.421 45.24 204.861 44.48 205.861 43.24L204.121 41.7C203.281 42.48 202.541 42.8 201.521 42.8C200.161 42.8 199.201 42.08 198.901 40.7H206.361C206.381 40.42 206.401 40.24 206.401 39.94ZM203.441 38.8H198.861C199.101 37.42 199.921 36.52 201.181 36.52C202.461 36.52 203.261 37.44 203.441 38.8ZM216.527 41.74V41.7C216.527 39.74 214.787 39.02 213.287 38.52C212.127 38.12 211.107 37.84 211.107 37.24V37.2C211.107 36.78 211.487 36.46 212.227 36.46C213.007 36.46 214.067 36.84 215.127 37.46L216.287 35.36C215.127 34.58 213.647 34.12 212.287 34.12C210.127 34.12 208.367 35.34 208.367 37.52V37.56C208.367 39.64 210.067 40.34 211.567 40.78C212.747 41.14 213.787 41.36 213.787 42.02V42.06C213.787 42.54 213.387 42.86 212.507 42.86C211.507 42.86 210.287 42.42 209.127 41.58L207.827 43.58C209.247 44.7 210.927 45.2 212.427 45.2C214.747 45.2 216.527 44.12 216.527 41.74ZM227.882 45V30.4H224.842V45H227.882ZM233.997 33.1V30.4H230.797V33.1H233.997ZM233.917 45V34.28H230.877V45H233.917ZM247.012 34.28H243.852L241.432 41.46L239.032 34.28H235.812L240.032 45.08H242.792L247.012 34.28ZM258.159 39.94V39.9C258.159 36.86 256.519 34.08 252.939 34.08C249.819 34.08 247.639 36.6 247.639 39.66V39.7C247.639 42.98 250.019 45.24 253.239 45.24C255.179 45.24 256.619 44.48 257.619 43.24L255.879 41.7C255.039 42.48 254.299 42.8 253.279 42.8C251.919 42.8 250.959 42.08 250.659 40.7H258.119C258.139 40.42 258.159 40.24 258.159 39.94ZM255.199 38.8H250.619C250.859 37.42 251.679 36.52 252.939 36.52C254.219 36.52 255.019 37.44 255.199 38.8ZM260.524 31V31.4L261.464 40.24H263.144L264.084 31.4V31H260.524ZM263.924 45V41.8H260.684V45H263.924Z"
        fill="white"
      />
      <path
        d="M131.791 61.374C131.437 61.7287 131.007 61.906 130.503 61.906C129.999 61.906 129.565 61.7287 129.201 61.374C128.847 61.0193 128.669 60.59 128.669 60.086V60.058C128.669 59.554 128.851 59.1247 129.215 58.77C129.579 58.4153 130.009 58.238 130.503 58.238C130.989 58.238 131.413 58.42 131.777 58.784C132.151 59.1387 132.337 59.5633 132.337 60.058V60.086C132.337 60.59 132.155 61.0193 131.791 61.374ZM142.386 65V55.2H146.558C147.669 55.2 148.523 55.4893 149.12 56.068C149.54 56.5067 149.75 57.0293 149.75 57.636V57.664C149.75 58.728 149.232 59.484 148.196 59.932C149.596 60.352 150.296 61.1407 150.296 62.298V62.326C150.296 63.1567 149.974 63.81 149.33 64.286C148.686 64.762 147.823 65 146.74 65H142.386ZM143.478 59.568H146.376C147.057 59.568 147.603 59.4187 148.014 59.12C148.425 58.812 148.63 58.378 148.63 57.818V57.79C148.63 57.2953 148.439 56.908 148.056 56.628C147.683 56.3387 147.151 56.194 146.46 56.194H143.478V59.568ZM143.478 64.006H146.768C147.515 64.006 148.103 63.852 148.532 63.544C148.961 63.2267 149.176 62.7973 149.176 62.256V62.228C149.176 61.6867 148.952 61.2713 148.504 60.982C148.065 60.6927 147.421 60.548 146.572 60.548H143.478V64.006ZM158.314 64.062C157.586 64.7993 156.685 65.168 155.612 65.168C154.538 65.168 153.642 64.804 152.924 64.076C152.214 63.3387 151.86 62.452 151.86 61.416V61.388C151.86 60.352 152.219 59.4653 152.938 58.728C153.666 57.9813 154.566 57.608 155.64 57.608C156.713 57.608 157.609 57.9767 158.328 58.714C159.046 59.442 159.406 60.324 159.406 61.36V61.388C159.406 62.424 159.042 63.3153 158.314 64.062ZM155.64 64.202C156.414 64.202 157.049 63.9313 157.544 63.39C158.048 62.8487 158.3 62.1907 158.3 61.416V61.388C158.3 60.604 158.038 59.9367 157.516 59.386C157.002 58.8353 156.368 58.56 155.612 58.56C154.846 58.56 154.212 58.8353 153.708 59.386C153.213 59.9273 152.966 60.5853 152.966 61.36V61.388C152.966 62.172 153.222 62.8393 153.736 63.39C154.249 63.9313 154.884 64.202 155.64 64.202ZM167.364 64.062C166.636 64.7993 165.736 65.168 164.662 65.168C163.589 65.168 162.693 64.804 161.974 64.076C161.265 63.3387 160.91 62.452 160.91 61.416V61.388C160.91 60.352 161.27 59.4653 161.988 58.728C162.716 57.9813 163.617 57.608 164.69 57.608C165.764 57.608 166.66 57.9767 167.378 58.714C168.097 59.442 168.456 60.324 168.456 61.36V61.388C168.456 62.424 168.092 63.3153 167.364 64.062ZM164.69 64.202C165.465 64.202 166.1 63.9313 166.594 63.39C167.098 62.8487 167.35 62.1907 167.35 61.416V61.388C167.35 60.604 167.089 59.9367 166.566 59.386C166.053 58.8353 165.418 58.56 164.662 58.56C163.897 58.56 163.262 58.8353 162.758 59.386C162.264 59.9273 162.016 60.5853 162.016 61.36V61.388C162.016 62.172 162.273 62.8393 162.786 63.39C163.3 63.9313 163.934 64.202 164.69 64.202ZM172.803 65.14C172.28 65.14 171.748 65.0467 171.207 64.86C170.675 64.664 170.208 64.4027 169.807 64.076L170.353 63.306C171.174 63.922 172.01 64.23 172.859 64.23C173.298 64.23 173.657 64.1273 173.937 63.922C174.217 63.7073 174.357 63.4273 174.357 63.082V63.054C174.357 62.7273 174.203 62.4753 173.895 62.298C173.596 62.1207 173.148 61.948 172.551 61.78C172.187 61.6773 171.898 61.584 171.683 61.5C171.468 61.416 171.226 61.2993 170.955 61.15C170.684 60.9913 170.484 60.7953 170.353 60.562C170.222 60.3287 170.157 60.0533 170.157 59.736V59.708C170.157 59.092 170.386 58.5927 170.843 58.21C171.31 57.8273 171.902 57.636 172.621 57.636C173.554 57.636 174.422 57.902 175.225 58.434L174.735 59.246C174.016 58.7793 173.302 58.546 172.593 58.546C172.173 58.546 171.832 58.644 171.571 58.84C171.319 59.036 171.193 59.288 171.193 59.596V59.624C171.193 59.7547 171.23 59.876 171.305 59.988C171.38 60.1 171.464 60.1933 171.557 60.268C171.65 60.3427 171.795 60.422 171.991 60.506C172.196 60.59 172.36 60.6507 172.481 60.688C172.602 60.7253 172.794 60.786 173.055 60.87C173.326 60.954 173.55 61.0287 173.727 61.094C173.914 61.1593 174.119 61.2527 174.343 61.374C174.576 61.486 174.758 61.612 174.889 61.752C175.029 61.8827 175.146 62.0507 175.239 62.256C175.332 62.4613 175.379 62.69 175.379 62.942V62.97C175.379 63.642 175.136 64.174 174.651 64.566C174.166 64.9487 173.55 65.14 172.803 65.14ZM179.667 65.126C179.042 65.126 178.542 64.9627 178.169 64.636C177.805 64.3 177.623 63.782 177.623 63.082V58.714H176.615V57.762H177.623V55.578H178.701V57.762H180.997V58.714H178.701V62.942C178.701 63.7447 179.107 64.146 179.919 64.146C180.274 64.146 180.624 64.062 180.969 63.894V64.818C180.577 65.0233 180.143 65.126 179.667 65.126ZM187.284 65V55.2H194.326V56.222H188.39V59.722H193.696V60.73H188.39V65H187.284ZM198.09 65.154C197.362 65.154 196.728 64.9533 196.186 64.552C195.654 64.1507 195.388 63.6 195.388 62.9V62.872C195.388 62.116 195.668 61.5327 196.228 61.122C196.788 60.7113 197.54 60.506 198.482 60.506C199.229 60.506 199.966 60.6087 200.694 60.814V60.59C200.694 59.9553 200.508 59.47 200.134 59.134C199.761 58.798 199.234 58.63 198.552 58.63C197.843 58.63 197.11 58.8027 196.354 59.148L196.032 58.266C196.928 57.8553 197.806 57.65 198.664 57.65C199.691 57.65 200.47 57.916 201.002 58.448C201.506 58.952 201.758 59.6613 201.758 60.576V65H200.694V63.922C200.05 64.7433 199.182 65.154 198.09 65.154ZM198.3 64.286C198.972 64.286 199.542 64.104 200.008 63.74C200.475 63.376 200.708 62.9093 200.708 62.34V61.668C199.999 61.4627 199.294 61.36 198.594 61.36C197.932 61.36 197.414 61.4953 197.04 61.766C196.667 62.0273 196.48 62.3773 196.48 62.816V62.844C196.48 63.2827 196.653 63.6327 196.998 63.894C197.353 64.1553 197.787 64.286 198.3 64.286ZM204.042 65V57.762H205.12V59.652C205.4 59.0267 205.797 58.5273 206.31 58.154C206.823 57.7807 207.411 57.608 208.074 57.636V58.798H207.99C207.159 58.798 206.473 59.0873 205.932 59.666C205.391 60.2447 205.12 61.0613 205.12 62.116V65H204.042ZM209.716 65V57.762H210.794V58.98C211.4 58.0653 212.18 57.608 213.132 57.608C214.214 57.608 214.989 58.0887 215.456 59.05C216.081 58.0887 216.93 57.608 218.004 57.608C218.834 57.608 219.488 57.8693 219.964 58.392C220.449 58.9147 220.692 59.624 220.692 60.52V65H219.614V60.772C219.614 60.072 219.446 59.5353 219.11 59.162C218.783 58.7793 218.326 58.588 217.738 58.588C217.168 58.588 216.692 58.7887 216.31 59.19C215.927 59.5913 215.736 60.1373 215.736 60.828V65H214.672V60.744C214.672 60.072 214.504 59.5447 214.168 59.162C213.841 58.7793 213.388 58.588 212.81 58.588C212.231 58.588 211.75 58.8027 211.368 59.232C210.985 59.6613 210.794 60.2073 210.794 60.87V65H209.716ZM223.06 56.18V54.99H224.292V56.18H223.06ZM223.13 65V57.762H224.208V65H223.13ZM226.71 65V57.762H227.788V59.022C228.357 58.0793 229.183 57.608 230.266 57.608C231.125 57.608 231.801 57.874 232.296 58.406C232.791 58.9287 233.038 59.6287 233.038 60.506V65H231.96V60.772C231.96 60.0907 231.783 59.5587 231.428 59.176C231.083 58.784 230.593 58.588 229.958 58.588C229.333 58.588 228.815 58.798 228.404 59.218C227.993 59.638 227.788 60.184 227.788 60.856V65H226.71ZM238.543 67.268C237.32 67.268 236.223 66.932 235.253 66.26L235.743 65.42C236.592 66.036 237.521 66.344 238.529 66.344C239.341 66.344 239.98 66.12 240.447 65.672C240.923 65.2333 241.161 64.5987 241.161 63.768V62.914C240.395 63.9313 239.448 64.44 238.319 64.44C237.404 64.44 236.606 64.1273 235.925 63.502C235.253 62.8673 234.917 62.0507 234.917 61.052V61.024C234.917 60.0067 235.257 59.1853 235.939 58.56C236.62 57.9253 237.413 57.608 238.319 57.608C239.476 57.608 240.419 58.0933 241.147 59.064V57.762H242.225V63.74C242.225 64.832 241.917 65.686 241.301 66.302C240.657 66.946 239.737 67.268 238.543 67.268ZM238.529 63.488C239.238 63.488 239.859 63.2593 240.391 62.802C240.923 62.3353 241.189 61.7473 241.189 61.038V61.01C241.189 60.2913 240.923 59.7033 240.391 59.246C239.868 58.7887 239.247 58.56 238.529 58.56C237.829 58.56 237.236 58.784 236.751 59.232C236.265 59.68 236.023 60.268 236.023 60.996V61.024C236.023 61.7333 236.265 62.3213 236.751 62.788C237.245 63.2547 237.838 63.488 238.529 63.488ZM131.791 79.374C131.437 79.7287 131.007 79.906 130.503 79.906C129.999 79.906 129.565 79.7287 129.201 79.374C128.847 79.0193 128.669 78.59 128.669 78.086V78.058C128.669 77.554 128.851 77.1247 129.215 76.77C129.579 76.4153 130.009 76.238 130.503 76.238C130.989 76.238 131.413 76.42 131.777 76.784C132.151 77.1387 132.337 77.5633 132.337 78.058V78.086C132.337 78.59 132.155 79.0193 131.791 79.374ZM142.386 83V73.2H146.558C147.669 73.2 148.523 73.4893 149.12 74.068C149.54 74.5067 149.75 75.0293 149.75 75.636V75.664C149.75 76.728 149.232 77.484 148.196 77.932C149.596 78.352 150.296 79.1407 150.296 80.298V80.326C150.296 81.1567 149.974 81.81 149.33 82.286C148.686 82.762 147.823 83 146.74 83H142.386ZM143.478 77.568H146.376C147.057 77.568 147.603 77.4187 148.014 77.12C148.425 76.812 148.63 76.378 148.63 75.818V75.79C148.63 75.2953 148.439 74.908 148.056 74.628C147.683 74.3387 147.151 74.194 146.46 74.194H143.478V77.568ZM143.478 82.006H146.768C147.515 82.006 148.103 81.852 148.532 81.544C148.961 81.2267 149.176 80.7973 149.176 80.256V80.228C149.176 79.6867 148.952 79.2713 148.504 78.982C148.065 78.6927 147.421 78.548 146.572 78.548H143.478V82.006ZM152.952 79.822C153.026 80.5593 153.302 81.1473 153.778 81.586C154.263 82.0153 154.837 82.23 155.5 82.23C156.368 82.23 157.128 81.8893 157.782 81.208L158.454 81.81C157.642 82.7153 156.648 83.168 155.472 83.168C154.454 83.168 153.596 82.818 152.896 82.118C152.205 81.4087 151.86 80.4987 151.86 79.388C151.86 78.3333 152.191 77.442 152.854 76.714C153.516 75.9767 154.342 75.608 155.332 75.608C156.368 75.608 157.189 75.972 157.796 76.7C158.402 77.428 158.706 78.3427 158.706 79.444C158.706 79.584 158.701 79.71 158.692 79.822H152.952ZM152.952 78.954H157.614C157.548 78.254 157.315 77.6753 156.914 77.218C156.522 76.7513 155.985 76.518 155.304 76.518C154.688 76.518 154.16 76.7467 153.722 77.204C153.283 77.6613 153.026 78.2447 152.952 78.954ZM163.015 83.126C162.389 83.126 161.89 82.9627 161.517 82.636C161.153 82.3 160.971 81.782 160.971 81.082V76.714H159.963V75.762H160.971V73.578H162.049V75.762H164.345V76.714H162.049V80.942C162.049 81.7447 162.455 82.146 163.267 82.146C163.621 82.146 163.971 82.062 164.317 81.894V82.818C163.925 83.0233 163.491 83.126 163.015 83.126ZM168.675 83.126C168.049 83.126 167.55 82.9627 167.177 82.636C166.813 82.3 166.631 81.782 166.631 81.082V76.714H165.623V75.762H166.631V73.578H167.709V75.762H170.005V76.714H167.709V80.942C167.709 81.7447 168.115 82.146 168.927 82.146C169.281 82.146 169.631 82.062 169.977 81.894V82.818C169.585 83.0233 169.151 83.126 168.675 83.126ZM172.352 79.822C172.427 80.5593 172.702 81.1473 173.178 81.586C173.663 82.0153 174.237 82.23 174.9 82.23C175.768 82.23 176.529 81.8893 177.182 81.208L177.854 81.81C177.042 82.7153 176.048 83.168 174.872 83.168C173.855 83.168 172.996 82.818 172.296 82.118C171.605 81.4087 171.26 80.4987 171.26 79.388C171.26 78.3333 171.591 77.442 172.254 76.714C172.917 75.9767 173.743 75.608 174.732 75.608C175.768 75.608 176.589 75.972 177.196 76.7C177.803 77.428 178.106 78.3427 178.106 79.444C178.106 79.584 178.101 79.71 178.092 79.822H172.352ZM172.352 78.954H177.014C176.949 78.254 176.715 77.6753 176.314 77.218C175.922 76.7513 175.385 76.518 174.704 76.518C174.088 76.518 173.561 76.7467 173.122 77.204C172.683 77.6613 172.427 78.2447 172.352 78.954ZM179.993 83V75.762H181.071V77.652C181.351 77.0267 181.748 76.5273 182.261 76.154C182.774 75.7807 183.362 75.608 184.025 75.636V76.798H183.941C183.11 76.798 182.424 77.0873 181.883 77.666C181.342 78.2447 181.071 79.0613 181.071 80.116V83H179.993ZM193.966 83.154C192.725 83.154 191.735 82.7853 190.998 82.048C190.261 81.3013 189.892 80.2513 189.892 78.898V73.2H190.998V78.828C190.998 79.8827 191.259 80.6993 191.782 81.278C192.314 81.8473 193.051 82.132 193.994 82.132C194.918 82.132 195.641 81.8567 196.164 81.306C196.687 80.7553 196.948 79.9527 196.948 78.898V73.2H198.054V78.814C198.054 80.214 197.685 81.2873 196.948 82.034C196.211 82.7807 195.217 83.154 193.966 83.154ZM200.767 83V73.2H201.873V83H200.767ZM203.063 84.792L209.559 71.828H210.553L204.057 84.792H203.063ZM215.773 83.154C214.531 83.154 213.542 82.7853 212.805 82.048C212.067 81.3013 211.699 80.2513 211.699 78.898V73.2H212.805V78.828C212.805 79.8827 213.066 80.6993 213.589 81.278C214.121 81.8473 214.858 82.132 215.801 82.132C216.725 82.132 217.448 81.8567 217.971 81.306C218.493 80.7553 218.755 79.9527 218.755 78.898V73.2H219.861V78.814C219.861 80.214 219.492 81.2873 218.755 82.034C218.017 82.7807 217.023 83.154 215.773 83.154ZM221.597 83L225.363 78.002L221.737 73.2H223.039L226.049 77.204L229.031 73.2H230.319L226.693 77.988L230.459 83H229.143L226.007 78.786L222.871 83H221.597Z"
        fill="white"
      />
      <path
        d="M24.3606 35.6437L43.5079 9.72428C44.5777 8.27607 46.6733 8.08984 47.9817 9.3267L66.5235 26.8541C68.2711 28.5061 67.4619 31.44 65.1145 31.9625L60.246 33.0463C58.8739 33.3517 57.8978 34.5689 57.8978 35.9746V66.0613C57.8978 67.3825 57.0335 68.5482 55.7692 68.9319L38.4288 74.1957C36.502 74.7806 34.5575 73.3387 34.5575 71.325V42.3942C34.5575 40.4352 32.7104 39.0018 30.8127 39.4881L27.5183 40.3324C24.7842 41.033 22.6835 37.9139 24.3606 35.6437Z"
        fill="#A076FF"
      />
      <path
        d="M83.3141 69.2903L96.4354 51.3668C97.5052 49.9054 99.6162 49.718 100.927 50.9681L113.578 63.0358C115.312 64.6897 114.503 67.6085 112.165 68.1337L110.252 68.5634C108.882 68.871 107.909 70.087 107.909 71.4905V93.6319C107.909 94.9503 107.048 96.1142 105.788 96.5003L93.9582 100.124C92.0298 100.715 90.0795 99.2722 90.0795 97.2554V76.699C90.0795 74.7819 88.2698 73.3806 86.4138 73.8605C83.7464 74.5503 81.6867 71.5134 83.3141 69.2903Z"
        fill="#A076FF"
      />
      <path
        d="M4.85077 88.6567L17.972 70.7332C19.0419 69.2718 21.1528 69.0844 22.4634 70.3345L35.1145 82.4023C36.8483 84.0562 36.0392 86.975 33.7013 87.5001L31.7881 87.9299C30.4187 88.2375 29.4456 89.4534 29.4456 90.857V112.998C29.4456 114.317 28.5849 115.481 27.3243 115.867L15.4948 119.49C13.5664 120.081 11.6162 118.639 11.6162 116.622V96.0654C11.6162 94.1483 9.80645 92.747 7.95039 93.227C5.28301 93.9167 3.22332 90.8798 4.85077 88.6567Z"
        fill="#A076FF"
      />
      <path
        d="M30.0156 116.017V65.7109C36.8236 68.1326 52.578 76.3205 61.1314 89.6989C69.6848 103.077 69.8128 121.134 68.8075 128.491L30.0156 116.017Z"
        fill="#3AFFF2"
        stroke="black"
      />
      <path
        d="M68.8075 128.491L105.73 116.905C107.411 116.378 108.544 114.815 108.46 113.056C108.076 105.021 106.218 82.6958 97.3189 72.0165C87.5062 60.2412 73.6324 55.1613 69.7425 54.0267C69.1276 53.8473 68.488 53.8839 67.8757 54.0721L30.0156 65.7111C36.8236 68.1328 52.578 76.3206 61.1314 89.699C69.6848 103.077 69.8127 121.135 68.8075 128.491Z"
        fill="white"
        stroke="black"
      />
      <path
        d="M87.7794 113.555L89.9938 112.815C90.7645 112.557 91.3001 111.87 91.3176 111.057C91.4245 106.077 91.1002 88.2546 81.6926 76.9507C71.5475 64.7607 62.0681 62.6566 59.675 62.2263C59.3702 62.1715 59.0623 62.1917 58.7649 62.278L56.6633 62.8877C54.799 63.4287 54.7541 65.9326 56.5791 66.5943C63.1187 68.9652 72.1785 73.2936 78.5397 83.2561C82.593 89.6042 84.8422 103.731 84.8893 111.371C84.8984 112.853 86.3738 114.025 87.7794 113.555Z"
        fill="black"
      />
      <path
        d="M76.9086 47.9373L83.7209 48.6895L75.6994 72.627C75.6994 72.627 75.3375 74.6557 72.6126 74.3548C69.8877 74.0539 68.8871 71.8749 68.8871 71.8749L76.9086 47.9373Z"
        fill="#3AFFF2"
        stroke="black"
      />
      <path
        d="M76.9085 47.9369L83.7208 48.689L79.8887 60.0049C79.8887 60.0049 79.1765 59.0928 76.3277 61.0732C73.4789 63.0536 70.1257 68.1498 70.1257 68.1498L76.9085 47.9369Z"
        fill="black"
      />
      <path
        d="M58.1667 47.8975L94.7588 38.8228C94.7588 38.8228 100.379 37.315 102.024 42.9351C103.669 48.5551 99.1452 50.4741 99.1452 50.4741L61.0457 61.3642L58.1667 47.8975Z"
        fill="white"
        stroke="black"
      />
      <path
        d="M61.0452 61.364L99.1148 50.5354C99.1148 50.5354 101.582 49.3919 102.13 46.9246C102.679 44.4572 101.993 42.9963 101.993 42.9963L64.5762 52.8829L61.0452 61.364Z"
        fill="#3AFFF2"
        stroke="black"
      />
      <ellipse
        cx="59.2635"
        cy="54.7525"
        rx="6.40977"
        ry="7.26993"
        transform="rotate(-13.5224 59.2635 54.7525)"
        fill="black"
      />
      <path
        d="M30.1531 115.88L68.945 128.49L57.4308 131.78L18.6389 119.169L30.1531 115.88Z"
        fill="black"
      />
      <g filter="url(#filter0_d_1543_44)">
        <path
          d="M47.3739 89.9247C47.6591 90.0009 47.7045 90.5058 47.7099 91.4956L47.7117 97.1818C47.7117 97.6104 47.7117 97.8247 47.8443 97.9573C47.9551 98.0662 48.1222 98.0862 48.4236 98.0898H50.5503C53.3289 98.0898 54.7164 98.0898 55.2413 98.9924C55.7679 99.895 55.0815 101.103 53.7085 103.516L49.4098 111.084C48.7287 112.283 48.3873 112.882 48.0495 112.791C47.7117 112.704 47.7117 112.016 47.7117 110.637V105.536C47.7117 105.107 47.7117 104.893 47.5792 104.76C47.4466 104.628 47.2323 104.628 46.8037 104.628H43.9978C41.7985 104.617 40.6489 104.528 40.1822 103.725C39.6555 102.823 40.342 101.615 41.715 99.2013L46.0137 91.6336C46.6947 90.435 47.0361 89.8357 47.3739 89.9265V89.9247Z"
          fill="black"
        />
      </g>
      <rect
        x="126.5"
        y="93.5"
        width="124"
        height="20"
        rx="10"
        fill="black"
        stroke="#00FFD1"
      />
      <path
        d="M140.786 107.418L139.414 106.032C138.644 106.732 137.958 107.18 136.838 107.18C135.158 107.18 133.996 105.78 133.996 104.1V104.072C133.996 102.392 135.186 101.02 136.838 101.02C137.818 101.02 138.588 101.44 139.344 102.126L140.716 100.544C139.806 99.648 138.7 99.032 136.852 99.032C133.842 99.032 131.742 101.314 131.742 104.1V104.128C131.742 106.942 133.884 109.168 136.768 109.168C138.658 109.168 139.778 108.496 140.786 107.418ZM149.162 109V104.142C149.162 102.42 148.224 101.356 146.614 101.356C145.536 101.356 144.906 101.93 144.416 102.56V98.78H142.288V109H144.416V104.814C144.416 103.806 144.934 103.288 145.746 103.288C146.558 103.288 147.034 103.806 147.034 104.814V109H149.162ZM158.011 105.458V105.43C158.011 103.302 156.863 101.356 154.357 101.356C152.173 101.356 150.647 103.12 150.647 105.262V105.29C150.647 107.586 152.313 109.168 154.567 109.168C155.925 109.168 156.933 108.636 157.633 107.768L156.415 106.69C155.827 107.236 155.309 107.46 154.595 107.46C153.643 107.46 152.971 106.956 152.761 105.99H157.983C157.997 105.794 158.011 105.668 158.011 105.458ZM155.939 104.66H152.733C152.901 103.694 153.475 103.064 154.357 103.064C155.253 103.064 155.813 103.708 155.939 104.66ZM166.205 107.796L164.959 106.536C164.441 107.026 163.951 107.334 163.237 107.334C162.075 107.334 161.333 106.41 161.333 105.262V105.234C161.333 104.128 162.089 103.19 163.153 103.19C163.909 103.19 164.385 103.512 164.861 104.016L166.163 102.616C165.463 101.832 164.581 101.356 163.167 101.356C160.871 101.356 159.233 103.12 159.233 105.262V105.29C159.233 107.432 160.885 109.168 163.139 109.168C164.637 109.168 165.477 108.594 166.205 107.796ZM174.861 109L171.907 104.45L174.763 101.496H172.215L169.723 104.226V98.78H167.595V109H169.723V106.718L170.465 105.934L172.425 109H174.861ZM187.763 101.16V99.2H180.301V109H182.457V105.206H187.133V103.246H182.457V101.16H187.763ZM197.915 109L193.715 99.13H191.727L187.527 109H189.725L190.621 106.802H194.765L195.661 109H197.915ZM193.995 104.898H191.391L192.693 101.72L193.995 104.898ZM207.898 109L205.504 105.5C206.75 105.038 207.604 104.044 207.604 102.462V102.434C207.604 100.418 206.218 99.2 203.908 99.2H199.428V109H201.584V105.864H203.278L205.378 109H207.898ZM205.42 102.574C205.42 103.4 204.818 103.96 203.768 103.96H201.584V101.146H203.726C204.776 101.146 205.42 101.622 205.42 102.546V102.574ZM219.345 109V99.2H217.021L214.445 103.344L211.869 99.2H209.545V109H211.659V102.644L214.389 106.788H214.445L217.203 102.602V109H219.345Z"
        fill="#00FFD1"
      />
      <rect x="224" y="98" width="20" height="10" rx="5" fill="#00FFD1" />
      <path
        d="M234.26 100H232.6L230.77 104.93L228.94 100H227.24L230.07 107.05H231.43L234.26 100ZM237.59 101.28C238.14 101.28 238.53 101.6 238.53 102.19C238.53 102.77 238.19 103.15 237.32 103.87L234.99 105.78V107H240.17V105.67H237.12L238.26 104.79C239.5 103.83 240.1 103.24 240.1 102.07C240.1 100.76 239.18 99.9 237.69 99.9C236.44 99.9 235.77 100.41 235.08 101.35L236.16 102.22C236.68 101.58 237.05 101.28 237.59 101.28Z"
        fill="black"
      />
      <defs>
        <filter
          id="filter0_d_1543_44"
          x="32.0049"
          y="81.9175"
          width="31.4136"
          height="38.8826"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 0.94 0 0 0 0.6 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1543_44"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1543_44"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1543_44"
          x1="286"
          y1="55"
          x2="15.5"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7F43FF" />
          <stop offset="1" stopColor="#00C6A2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
