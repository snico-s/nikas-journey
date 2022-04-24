import React, { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import Link from "next/dist/client/link";
import classes from "./main-header.module.css";

import logo from "../../assets/nikas-journey-logo.png";
import Image from "next/image";
import { Rect } from "maplibre-gl";

function MainHeader() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuSrOnlySpan = useRef<HTMLSpanElement>(null);

  console.log(session);

  let resizeTimer: any;
  useEffect(() => {
    window.addEventListener("resize", () => {
      document.body.classList.add("resize-animation-stopper");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
      }, 400);
    });
  }, []);

  return (
    <header className={`${classes.primaryHeader} ${classes.flex}`}>
      <div className={classes.logo}>
        <Link href="/">
          <a>
            <Image
              src="/nikas-journey-logo.png"
              alt="Nikas Journey Logo"
              width={48}
              height={48}
            />
          </a>
        </Link>
      </div>

      <button
        className={`${classes.mobileNavToggle} ${
          isOpen ? classes.open : classes.close
        }`}
        aria-controls="primary-navigation"
        onClick={() => {
          setIsOpen((currentIsOpen) => !currentIsOpen);
          if (menuSrOnlySpan.current) {
            if (isOpen)
              menuSrOnlySpan.current.setAttribute("aria-expanded", "true");
            if (!isOpen)
              menuSrOnlySpan.current.setAttribute("aria-expanded", "false");
          }
        }}
      >
        <span className="sr-only" aria-expanded="false" ref={menuSrOnlySpan}>
          Menu
        </span>
      </button>

      <nav>
        <ul
          id="primary-navigation"
          data-visible="false"
          className={`${classes.primaryNavigation} ${classes.flex} ${
            isOpen ? classes.open : classes.close
          }`}
        >
          {/* <li className={`${classes.active}`}>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/ueber-uns">Über uns</Link>
          </li>
          <li>
            <Link href="/route">Route</Link>
          </li>
          <li>
            <Link href="/ausruestung">Ausrüstung</Link>
          </li> */}
          {!session ? (
            ""
          ) : (
            // <li>
            //   <Link href="/api/auth/signin">
            //     <a
            //       onClick={(e: React.MouseEvent<HTMLElement>) => {
            //         e.preventDefault;
            //         signIn();
            //       }}
            //     >
            //       Sign In
            //     </a>
            //   </Link>
            // </li>
            <>
              <li>
                <Link href="/api/auth/signout">
                  <a
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.preventDefault;
                      signOut();
                    }}
                  >
                    Sign Out
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/admin">Admin</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainHeader;
