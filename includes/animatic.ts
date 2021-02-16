var devmode = false;
var ctx: CanvasRenderingContext2D;
var canvasfullscreen = false;
var mouseX = 0;
var mouseY = 0;
var set = 0;
var click = false;
var mousepressed = false;
var index_list = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var defauloffsetX = 1.5;
var defauloffsetY = 0;

import { upscale, invisible_mouse_collider } from "./ui.js";

function animatic_var_update(actx: CanvasRenderingContext2D) {
  ctx = actx;
}

function animatic_var_update2(adevmode: boolean) {
  devmode = adevmode;
}

function animatic_var_update3(
  acanvasfullscreen: boolean,
  amouseX: number,
  amouseY: number,
  aclick: boolean,
  amousepressed: boolean
) {
  canvasfullscreen = acanvasfullscreen;
  mouseX = amouseX;
  mouseY = amouseY;
  click = aclick;
  mousepressed = amousepressed;
}

function animatic_text(
  text: string,
  index: number,
  posX: number,
  posY: number,
  width: number,
  height: number,
  textX: number,
  textY: number,
  textscale1: number,
  textscale2: number,
  textscale3: number,
  textscale4: number,
  offsetX = 0,
  offsetY = 0
) {
  defauloffsetX = 1.5;
  defauloffsetY = 0;
  if (invisible_mouse_collider(posX, posY, width, height) === true) {
    //play
    switch (index_list[index]) {
      case 0:
        ctx.font = "Bold " + upscale(textscale2) + "px arial";
        ctx.fillText(
          text,
          upscale(
            textX - (textscale2 - textscale1) * (defauloffsetX - offsetX)
          ),
          upscale(textY + (textscale2 - textscale1) * (defauloffsetY + offsetY))
        );
        index_list.splice(index, 1, 1);
        break;
      case 1:
        ctx.font = "Bold " + upscale(textscale3) + "px arial";
        ctx.fillText(
          text,
          upscale(
            textX - (textscale3 - textscale1) * (defauloffsetX - offsetX)
          ),
          upscale(textY + (textscale3 - textscale1) * (defauloffsetY + offsetY))
        );
        index_list.splice(index, 1, 2);
        break;
      case 2:
        ctx.font = "Bold " + upscale(textscale4) + "px arial";
        ctx.fillText(
          text,
          upscale(
            textX - (textscale4 - textscale1) * (defauloffsetX - offsetX)
          ),
          upscale(textY + (textscale4 - textscale1) * (defauloffsetY + offsetY))
        );
        break;
    }
    if (click === true && mousepressed === false) {
      index_list.splice(index, 1, 0);
      return true;
    }
  } else {
    switch (index_list[index]) {
      case 2:
        ctx.font = "Bold " + upscale(textscale3) + "px arial";
        ctx.fillText(
          text,
          upscale(
            textX - (textscale3 - textscale1) * (defauloffsetX - offsetX)
          ),
          upscale(textY + (textscale3 - textscale1) * (defauloffsetY + offsetY))
        );
        index_list.splice(index, 1, 1);
        break;
      case 1:
        ctx.font = "Bold " + upscale(textscale2) + "px arial";
        ctx.fillText(
          text,
          upscale(
            textX - (textscale2 - textscale1) * (defauloffsetX - offsetX)
          ),
          upscale(textY + (textscale2 - textscale1) * (defauloffsetY + offsetY))
        );
        index_list.splice(index, 1, 0);
        break;
      case 0:
        ctx.font = "Bold " + upscale(textscale1) + "px arial";
        ctx.fillText(text, upscale(textX), upscale(textY));
        break;
    }
  }
  return false;
}

function animatic_texture(
  texture: HTMLImageElement,
  index: number,
  posX: number,
  posY: number,
  width: number,
  height: number,
  textureX: number,
  textureY: number,
  texturescale1: number[],
  texturescale2: number,
  texturescale3: number,
  texturescale4: number,
  offsetX = 0,
  offsetY = 0,
  text_show = "",
  textX = 0,
  textY = 0,
  textscale = 10,
  text_color = "rgb(255,255,255)"
) {
  var ratio = texturescale1[0] / texturescale1[1];
  defauloffsetX = 0.5;
  defauloffsetY = -0.5;

  if (invisible_mouse_collider(posX, posY, width, height) === true) {
    //set fullscren
    switch (index_list[index]) {
      case 0:
        ctx.drawImage(
          texture,
          upscale(
            textureX -
              (texturescale2 - texturescale1[0]) * (defauloffsetX - offsetX)
          ),
          upscale(
            textureY +
              (texturescale2 - texturescale1[1]) * (defauloffsetY + offsetY)
          ),
          upscale(texturescale2 * ratio),
          upscale(texturescale2)
        );
        index_list.splice(index, 1, 1);
        break;
      case 1:
        ctx.drawImage(
          texture,
          upscale(
            textureX -
              (texturescale3 - texturescale1[0]) * (defauloffsetX - offsetX)
          ),
          upscale(
            textureY +
              (texturescale3 - texturescale1[1]) * (defauloffsetY + offsetY)
          ),
          upscale(texturescale3 * ratio),
          upscale(texturescale3)
        );
        index_list.splice(index, 1, 2);
        break;
      case 2:
        ctx.drawImage(
          texture,
          upscale(
            textureX -
              (texturescale4 * ratio - texturescale1[0]) *
                (defauloffsetX - offsetX)
          ),
          upscale(
            textureY +
              (texturescale4 - texturescale1[1]) * (defauloffsetY + offsetY)
          ),
          upscale(texturescale4 * ratio),
          upscale(texturescale4)
        );
        if (text_show != "") {
          ctx.fillStyle = text_color;
          ctx.font = "Bold " + upscale(textscale) + "px arial";
          ctx.fillText(text_show, upscale(textX), upscale(textY));
        }
        break;
    }
    if (click === true && mousepressed === false) {
      index_list.splice(index, 1, 0);
      return true;
    }
  } else {
    switch (index_list[index]) {
      case 2:
        ctx.drawImage(
          texture,
          upscale(
            textureX -
              (texturescale3 - texturescale1[0]) * (defauloffsetX - offsetX)
          ),
          upscale(
            textureY +
              (texturescale3 - texturescale1[1]) * (defauloffsetY + offsetY)
          ),
          upscale(texturescale3 * ratio),
          upscale(texturescale3)
        );
        index_list.splice(index, 1, 1);
        break;
      case 1:
        ctx.drawImage(
          texture,
          upscale(
            textureX -
              (texturescale2 - texturescale1[0]) * (defauloffsetX - offsetX)
          ),
          upscale(
            textureY +
              (texturescale2 - texturescale1[1]) * (defauloffsetY + offsetY)
          ),
          upscale(texturescale2 * ratio),
          upscale(texturescale2)
        );
        index_list.splice(index, 1, 0);
        break;
      case 0:
        ctx.drawImage(
          texture,
          upscale(textureX),
          upscale(textureY),
          upscale(texturescale1[0]),
          upscale(texturescale1[1])
        );
        break;
    }
  }
  return false;
}

function transition_plus(canvas: HTMLCanvasElement) {
  if (0.05 * index_list[8] != 1) {
    ctx.fillStyle = "rgba(0,0,0," + 0.05 * index_list[8] + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    index_list.splice(8, 1, index_list[8] + 1);
    return "true";
  } else {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return "finish";
  }
}

function transition_minus(canvas: HTMLCanvasElement, transition: string) {
  if (transition != "true") {
    if (index_list[8] != 0) {
      ctx.fillStyle = "rgba(0,0,0," + 0.05 * index_list[8] + ")";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      index_list.splice(8, 1, index_list[8] - 1);
    }
  }
}

export {
  animatic_text,
  animatic_texture,
  transition_plus,
  transition_minus,
  animatic_var_update,
  animatic_var_update2,
  animatic_var_update3,
};