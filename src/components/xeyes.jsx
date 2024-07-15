import { useMemo, useRef, useState, useEffect } from 'react';
import { useWindowSize } from './useWindowSize'

import { TextStyle, Point, filters } from 'pixi.js';
import { Stage, Container, useTick, Sprite } from '@pixi/react';

import bustupimage from "../images/atri/atri_bustup.png"
import pupilimage from "../images/atri/atri_pupil.png"


class xeyesHandler {
    constructor(eyeRadius,
        eclipseRate,
        pupilRadius,
        eyeXOffset,
        eyeYOffset,
        distanceBetweenEyes) {

        this.eyeRadius = eyeRadius;
        this.eclipseRate = eclipseRate;
        this.pupilRadius = pupilRadius;
        this.eyeXOffset = eyeXOffset;
        this.eyeYOffset = eyeYOffset;
        this.distanceBetweenEyes = distanceBetweenEyes;
        this.pupilImage = new Image();
    }

    rangeFilter(value, min, max) {
        if (value < min)
            return min;
        if (value > max)
            return max;

        return value;
    }
    drawEyes(ctx, canvas, mouseX, mouseY, imageBeforeDrawAction, imageAfterDrawAction) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const leftEyeX = this.eyeXOffset;
        const rightEyeX = leftEyeX + (this.eyeRadius * 2) + this.distanceBetweenEyes;
        const eyeY = this.eyeYOffset;

        // const leftPupilX = this.rangeFilter(leftEyeX + (mouseX - leftEyeX) / 10, leftEyeX - this.eyeRadius + (this.pupilRadius * this.eclipseRate), leftEyeX + this.eyeRadius - (this.pupilRadius * this.eclipseRate))
        const leftPupilX = this.rangeFilter(leftEyeX + (mouseX - leftEyeX) / 10, leftEyeX - this.eyeRadius + (this.pupilRadius * 1.5), leftEyeX + this.eyeRadius - (this.pupilRadius * 1.5))
        // const leftPupilY = this.rangeFilter(eyeY + (mouseY - eyeY) / 10, eyeY - (this.eyeRadius * this.eclipseRate) + (this.pupilRadius * this.eclipseRate), eyeY + (this.eyeRadius * this.eclipseRate) - (this.pupilRadius * this.eclipseRate))
        const leftPupilY = this.rangeFilter(eyeY + (mouseY - eyeY) / 10, eyeY - (this.eyeRadius * this.eclipseRate) + (this.pupilRadius * 2), eyeY + (this.eyeRadius * this.eclipseRate) - (this.pupilRadius * 2))

        // const rightPupilX = this.rangeFilter(rightEyeX + (mouseX - rightEyeX) / 10, rightEyeX - this.eyeRadius + (this.pupilRadius * this.eclipseRate), rightEyeX + this.eyeRadius - (this.pupilRadius * this.eclipseRate))
        const rightPupilX = this.rangeFilter(rightEyeX + (mouseX - rightEyeX) / 10, rightEyeX - this.eyeRadius + (this.pupilRadius * 1.5), rightEyeX + this.eyeRadius - (this.pupilRadius * 1.5))
        // const rightPupilY = this.rangeFilter(eyeY + (mouseY - eyeY) / 10, eyeY - (this.eyeRadius * this.eclipseRate) + (this.pupilRadius * this.eclipseRate), eyeY + (this.eyeRadius * this.eclipseRate) - (this.pupilRadius * this.eclipseRate))
        const rightPupilY = this.rangeFilter(eyeY + (mouseY - eyeY) / 10, eyeY - (this.eyeRadius * this.eclipseRate) + (this.pupilRadius * 2), eyeY + (this.eyeRadius * this.eclipseRate) - (this.pupilRadius * 2)) - 3;

        if (imageBeforeDrawAction != null)
            imageBeforeDrawAction(ctx);
        this.drawEye(ctx, leftEyeX, eyeY, leftPupilX, leftPupilY);
        console.log("leftEyeX", leftEyeX, "rightEyeX", rightEyeX)
        this.drawEye(ctx, rightEyeX, eyeY, rightPupilX, rightPupilY);
        if (imageAfterDrawAction != null)
            imageAfterDrawAction(ctx);
    }

    drawEye(ctx, x, y, pupilX, pupilY) {
        // Draw the eye
        // ctx.beginPath();
        // // ctx.arc(x, y, eyeRadius, 0, Math.PI * 2, true);
        // ctx.ellipse(x, y, this.eyeRadius, this.eyeRadius * this.eclipseRate, Math.PI, 0, 2 * Math.PI);
        // ctx.fillStyle = 'white'
        // ctx.fill();
        // ctx.stroke();

        // Draw the pupil
        ctx.beginPath();
        this.pupilImage.src = pupilimage;
        // ctx.arc(pupilX, pupilY, this.pupilRadius, 0, Math.PI * 2, true);
        ctx.drawImage(this.pupilImage, pupilX, pupilY, 33, 41)
        ctx.fillStyle = 'black'
        ctx.fill();
    }
}

export const Xeyes = () => {
    // contextを状態として持つ
    const [context, setContext] = useState(null)
    const [canvas, setCanvas] = useState(null)
    // 画像読み込み完了トリガー
    const [loaded, setLoaded] = useState(false)
    //マウス移動時
    document.addEventListener('onmousemove', onmousemove);

    const img = new Image()
    const drawHandler = new xeyesHandler(
        23, //eyeRadius 
        1.2, //eclipseRate 
        8, //pupilRadius 
        220, //eyeXOffset 
        270, //eyeYOffset 
        65 //distanceBetweenEyes 
    );

    onmousemove = function (e) {
        if (canvas == null)
            return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        drawHandler.drawEyes(context, canvas, mouseX, mouseY,
            //瞳より下のレイヤーで描画
            ctx => {
                if (loaded) {
                    ctx.beginPath();
                    ctx.arc(245, 285, 30, 0, 2 * Math.PI);
                    ctx.arc(350, 285, 30, 0, 2 * Math.PI);
                    ctx.fillStyle = 'white'
                    ctx.fill();
                }
            }
            ,
            //瞳より上のレイヤーで描画
            ctx => {
                if (loaded) {
                    img.src = bustupimage
                    ctx.drawImage(img, 0, 0, 600, 600)
                    console.log("draw dora")
                }
            });
    }

    // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
    useEffect(() => {
        const canvas = document.getElementById("canvas")
        const canvasContext = canvas.getContext("2d")
        setCanvas(canvas)
        setContext(canvasContext)
    }, [])
    // 状態にコンテキストが登録されたらそれに対して操作できる
    useEffect(() => {
        if (context !== null) {
            img.src = bustupimage // 描画する画像など
            // img.src = "img.jpg" // 描画する画像など
            img.onload = () => {
                //     // 更にこれに続いて何か処理をしたい場合
                setLoaded(true)
            }

            // drawEyes(context, canvas,canvas.width / 2, canvas.height / 2);
        }
    }, [context])
    useEffect(() => {
        if (loaded) {
            // それに続く処理
        }
    }, [loaded])
    return <center>
        <canvas width="600" height="600" id="canvas"></canvas>
    </center>
};