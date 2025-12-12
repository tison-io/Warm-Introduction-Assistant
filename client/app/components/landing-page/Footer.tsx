"use client";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="footer-bg">
      <div className="footer-row">
        <div className="footer-left">
          <img src="/logo.png" alt="Warmly Logo" className="footer-logo" />
          <div className="footer-desc">
            The easiest way to manage investor introductions.
          </div>
        </div>
        <div className="footer-center">
          <div className="footer-links-title">Nav Links</div>
          <div className="footer-links-cols">
            <div className="footer-links-col">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/investors" className="footer-link">Investors</Link>
              <Link href="/startups" className="footer-link">Startups</Link>
            </div>
            <div className="footer-links-col">
              <Link href="/terms-of-service" className="footer-link">Terms of Service</Link>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/about" className="footer-link">About Us</Link>
            </div>
          </div>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-copyright">
        © 2025 Warm Introduction Assistant. All rights reserved.
      </div>
      <style jsx>{`
        .footer-bg {
          background: #fff;
          width: 100%;
          padding: 40px 10vw 0 10vw;
          border-top: 1px solid #ececec;
          font-family: inherit;
        }
        .footer-row {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-evenly;
        }
        .footer-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 240px;
        }
        .footer-logo {
          width: 90px;
          margin-bottom: 6px;
        }
        .footer-desc {
          color: #222;
          font-size: 15px;
          margin-top: 2px;
          font-weight: 600;
        }
        .footer-center {
          min-width: 290px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .footer-links-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .footer-links-cols {
          display: flex;
          gap: 45px;
        }
        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .footer-link {
          color: #333;
          text-decoration: none;
          font-size: 15px;
          transition: color 0.13s;
        }
        .footer-link:hover, .footer-link:focus {
          color: #175de6;
          text-decoration: underline;
        }
        .footer-divider {
          margin: 23px 0 7px 0;
          border: none;
          border-top: 1px solid #ececec;
        }
        .footer-copyright {
          text-align: center;
          font-size: 15px;
          color: #757575;
          margin-bottom: 8px;
        }
        @media (max-width: 768px) {
          .footer-bg {
            padding: 24px 4vw 0 4vw;
            text-align: center;
          }
          .footer-row {
            flex-direction: column;
            gap: 28px;
            align-items: center;
            justify-content: center;
          }
          .footer-left {
            align-items: center;
            text-align: center;
          }
          .footer-center {
            margin-left: 0;
            align-items: center;
            text-align: center;
          }
          .footer-links-cols {
            gap: 20px;
            flex-direction: column;
            align-items: center;
          }
          .footer-links-col {
            align-items: center;
            text-align: center;
          }
          .footer-logo {
            width: 80px;
          }
          .footer-desc {
            font-size: 14px;
            text-align: center;
          }
          .footer-links-title {
            font-size: 16px;
            text-align: center;
          }
          .footer-link {
            font-size: 14px;
          }
          .footer-copyright {
            font-size: 13px;
          }
        }
      `}</style>
    </footer>
  );
}