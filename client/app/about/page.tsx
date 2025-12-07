"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="about-bg">
      <button className="about-back" onClick={() => router.back()}>
        <span role="img" aria-label="back">←</span> Back
      </button>
      <div className="about-content">
        <h1 className="about-title">About Us</h1>
        <div className="about-desc">
          We are a platform built to make meaningful connections simple, secure, and effortless. Our focus is on creating a smooth experience that helps people interact, collaborate, and get things done without unnecessary complexity. Every feature we design aims to save time, reduce friction, and empower users with tools that feel reliable and intuitive.
        </div>
        <h2 className="about-section-title">Our Purpose</h2>
        <div className="about-purpose">
          Our purpose is to bridge gaps—between people, ideas, and opportunities. We exist to make communication easier by providing a trusted space where users can connect confidently and achieve what matters to them. Everything we do centers on improving clarity, convenience, and accessibility in everyday interactions.
        </div>
        <h2 className="about-section-title">What We Stand For</h2>
        <div className="about-values-row">
          <div className="about-value">
            <span className="about-value-icon" role="img" aria-label="privacy">🔒</span>
            <div className="about-value-name">Privacy</div>
            <div className="about-value-desc">
              Your data is always handled with respect and responsibility.
            </div>
          </div>
          <div className="about-value">
            <span className="about-value-icon" role="img" aria-label="reliability">🏅</span>
            <div className="about-value-name">Reliability</div>
            <div className="about-value-desc">
              A platform you can depend on, anytime.
            </div>
          </div>
          <div className="about-value">
            <span className="about-value-icon" role="img" aria-label="simplicity">🌱</span>
            <div className="about-value-name">Simplicity</div>
            <div className="about-value-desc">
              Clean, intuitive experiences without the clutter.
            </div>
          </div>
          <div className="about-value">
            <span className="about-value-icon" role="img" aria-label="integrity">📝</span>
            <div className="about-value-name">Integrity</div>
            <div className="about-value-desc">
              Clear policies, honest communication, and ethical practices.
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .about-bg {
          min-height: 100vh;
          width: 100vw;
          background: url("/backeground.jpg");
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .about-back {
          background: none;
          border: none;
          color: #e9eafd;
          font-size: 17px;
          padding: 18px 32px 0 22px;
          cursor: pointer;
          font-weight: 500;
        }
        .about-content {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
          width: 95vw;
        }
        .about-title {
          color: #fff;
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 19px;
        }
        .about-desc, .about-purpose {
          color: #f4f5ff;
          font-size: 1.20rem;
          margin: 23px 0 23px 0;
          font-weight: 400;
        }
        .about-section-title {
          color: #fff;
          font-size: 2rem;
          font-weight: 700;
          margin: 44px 0 4px 0;
        }
        .about-values-row {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 44px;
          margin-top: 28px;
          margin-bottom: 38px;
          flex-wrap: wrap;
        }
        .about-value {
          min-width: 170px;
          max-width: 230px;
          flex: 1;
          background: none;
          margin: 0 8px;
        }
        .about-value-icon {
          font-size: 2.7rem;
          display: block;
          margin-bottom: 7px;
        }
        .about-value-name {
          color: #fff;
          font-weight: 700;
          font-size: 1.13rem;
          margin-bottom: 4px;
        }
        .about-value-desc {
          color: #e3ebfa;
          font-size: 1rem;
        }
        @media (max-width: 800px) {
          .about-content {
            width: 99vw;
            padding: 0 2vw;
          }
          .about-values-row {
            gap: 20px;
            flex-wrap: wrap;
          }
        }
        @media (max-width: 660px) {
          .about-section-title { font-size: 1.4rem; }
          .about-title { font-size: 1.6rem; margin-top: 9px;}
          .about-value-icon { font-size: 2.1rem; }
          .about-values-row{ flex-direction: column; align-items: center; gap: 18px;}
        }
      `}</style>
    </div>
  );
}