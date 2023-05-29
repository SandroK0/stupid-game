import { AnyMxRecord } from "dns";
import React, { useEffect, useRef, useState } from "react";

export default function Canvas(props: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let SCALE = 350;

  function background(ctx: any, canvas: any) {
    let blockScale = canvas.width / 7;
    let pos = [0, 0];
    for (let i = 0; i < canvas.height / blockScale; i++) {
      for (let j = 0; j < canvas.width / blockScale; j++) {
        ctx.fillStyle = "darkblue";
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 2;
        ctx.fillRect(pos[0], pos[1], blockScale, blockScale);
        ctx.strokeRect(pos[0], pos[1], blockScale, blockScale);
        pos[0] += blockScale;
      }
      pos[0] = 0;
      pos[1] += blockScale;
    }
  }

  function drawTower(ctx: any, TOWER: any, canvas: any) {
    let blockScale = canvas.width / 7;

    for (let i = 0; i < TOWER.length; i++) {
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "grey";
      ctx.lineWidth = 2;
      ctx.fillRect(TOWER[i].X, TOWER[i].Y, TOWER[i].W, blockScale);
      ctx.strokeRect(TOWER[i].X, TOWER[i].Y, TOWER[i].W, blockScale);
    }
  }

  function updateScreen(
    P: any,
    Ground: any,
    ctx: any,
    TOWER: AnyMxRecord,
    canvas: any
  ) {
    background(ctx, canvas);
    drawGround(Ground, ctx, canvas);
    drawPlayer(P, ctx, canvas);
    drawTower(ctx, TOWER, canvas);
  }

  function drawPlayer(P: any, ctx: any, canvas: any) {
    let blockScale = canvas.width / 7;

    ctx.fillStyle = "blue";
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;
    ctx.fillRect(P.X, P.Y, P.W, blockScale);
    ctx.strokeRect(P.X, P.Y, P.W, blockScale);
  }

  function drawGround(Ground: any, ctx: any, canvas: any) {
    let blockScale = canvas.width / 7;

    ctx.fillStyle = "blue";
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;
    ctx.fillRect(Ground.X, Ground.Y, Ground.W, blockScale);
    ctx.strokeRect(Ground.X, Ground.Y, Ground.W, blockScale);
  }

  function check(P: any, Ground: any) {
    let difference = P.X + P.W - (Ground.X + Ground.W);
    if (difference < 0) {
      P.W -= Math.abs(difference);
      P.X = Ground.X;
    } else if (difference > 0) {
      P.W -= Math.abs(difference);
    }
  }

  function handlePress(P: any, TOWER: any, Ground: any, canvas: any) {
    let blockScale = canvas.width / 7;

    P.S = 0;

    if (Ground.X != -1) {
      check(P, Ground);
    }

    if (P.W < 0) {
      P.W = 0;
    }

    Ground.X = P.X;
    Ground.Y = P.Y;
    Ground.W = P.W;

    TOWER.push({ ...Ground });
    P.Y -= blockScale;
    P.S += blockScale;
  }

  function Play(ctx: any, canvas: any) {
    let blockScale = canvas.width / 7;

    background(ctx, canvas);

    const P = {
      X: 100,
      Y: canvas.height - blockScale,
      W: 3 * blockScale,
      S: blockScale,
      D: 1,
    };

    let Ground: any = {
      X: -1,
      Y: 0,
      W: 0,
    };

    let TOWER: any = [];

    const action = setInterval(() => {
      if (P.D === 1) {
        P.X += P.S;
        if (P.X + P.W === canvas.width) {
          P.D = 0;
        }
      } else if (P.D === 0) {
        P.X -= P.S;
        if (P.X === 0) {
          P.D = 1;
        }
      }
      if (P.W <= 0) {
        clearInterval(action);
        Play(ctx, canvas);
      }
      if (P.Y === -blockScale) {
        clearInterval(action);
        Play(ctx, canvas);
      }

      // if (P.Y < canvas.height - 3 * blockScale && P.W === 3 * blockScale) {
      //   P.W -= blockScale;
      // }

      updateScreen(P, Ground, ctx, TOWER, canvas);
    }, 150);

    document.addEventListener("keydown", (e) => {
      if (e.keyCode === 32) {
        handlePress(P, TOWER, Ground, canvas);
      }
    });
    canvas.addEventListener("click", () => {
      handlePress(P, TOWER, Ground, canvas);
    });
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        Play(ctx, canvas);
      }
    }
  }, []);

  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width={SCALE}
      height={(SCALE * 12) / 7}
      style={{ border: "1px solid black" }}
    ></canvas>
  );
}
