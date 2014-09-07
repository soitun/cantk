/*
 * File:   ui-check-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Check Box
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICheckBox() {
	return;
}

UICheckBox.prototype = new UIElement();
UICheckBox.prototype.isUICheckBox = true;

UICheckBox.prototype.initUICheckBox = function(type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_INPUT);
	this.images.display = CANTK_IMAGE_DISPLAY_SCALE;

	onFocusedImg  = onFocusedImg ? onFocusedImg : onImg;
	onActiveImg   = onActiveImg ? onActiveImg : onImg;
	offFocusedImg = offFocusedImg ? offFocusedImg : offImg;
	offActiveImg   = offActiveImg ? offActiveImg : offImg;

	this.setImage(CANTK_IMAGE_ON_FG, onImg);
	this.setImage(CANTK_IMAGE_ON_ACTIVE, onActiveImg);
	this.setImage(CANTK_IMAGE_ON_FOCUSED, onFocusedImg);
	this.setImage(CANTK_IMAGE_OFF_FG, offImg);
	this.setImage(CANTK_IMAGE_OFF_ACTIVE, offActiveImg);
	this.setImage(CANTK_IMAGE_OFF_FOCUSED, offFocusedImg);
	this.addEventNames(["onChanged", "onOnUpdateTransform"]);
	this.setRoundRadius(5);
	this.value = true;

	return this;
}

UICheckBox.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUILabel;
}

UICheckBox.prototype.getValue = function() {
	return this.value;
}

UICheckBox.prototype.setValue = function(value) {
	if(this.value != value) {
		this.value = value;
		this.callOnChanged(this.value);
	}

	return;
}

UICheckBox.prototype.getFgImage =function() {
	var image = null;
	var offset = 5;
	if(this.value) {
		if(this.pointerDown) {
			image = this.getImageByType(CANTK_IMAGE_ON_ACTIVE).getImage();
			this.offsetX = image ? 0 : offset;
			this.offsetY = image ? 0 : offset;
		}
		else {
			delete this.offsetX;
			delete this.offsetY;
			if(this.selected) {
				image = this.getImageByType(CANTK_IMAGE_ON_FOCUSED).getImage();
			}
		}

		if(!image) {
			image = this.getImageByType(CANTK_IMAGE_ON_FG).getImage();
		}
	}
	else {
		if(this.pointerDown) {
			image = this.getImageByType(CANTK_IMAGE_OFF_ACTIVE).getImage();
			this.offsetX = image ? 0 : offset;
			this.offsetY = image ? 0 : offset;
		}
		else {
			delete this.offsetX;
			delete this.offsetY;
			if(this.selected) {
				image = this.getImageByType(CANTK_IMAGE_OFF_FOCUSED).getImage();
			}
		}

		if(!image) {
			image = this.getImageByType(CANTK_IMAGE_OFF_FG).getImage();
		}
	}

	if(!image) {
		delete this.offsetX;
		delete this.offsetY;
	}

	return image;
}

Shape.prototype.getTextColor = function(canvas) {
	return this.value ? this.style.fillColor : this.style.textColor;
}

Shape.prototype.getBgColor = function(canvas) {
	return !this.value ? this.style.fillColor : this.style.textColor;
}

UICheckBox.prototype.drawFgImage =function(canvas) {
	var image = this.getFgImage();

	if(image) {
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h);
	}
	else {
		var hw = this.w >> 1;
		var hh = this.h >> 1;

		canvas.beginPath();
		if(!this.roundRadius) {
			canvas.rect(0, 0, this.w, this.h);
		}
		else if(this.roundRadius < hw && this.roundRadius < hh) {
			drawRoundRect(canvas, this.w, this.h, this.roundRadius);
		}
		else {
			canvas.arc(hw, hh, Math.min(hh, hw), 0, Math.PI * 2);
		}

		canvas.fillStyle = this.getBgColor();
		canvas.strokeStyle = this.getLineColor();
		canvas.lineWidth = this.pointerDown ? 2 * this.style.lineWidth : this.style.lineWidth;
		canvas.fill();
		canvas.stroke();
	}

	return;
}

UICheckBox.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	this.setValue(!this.value);
	this.callClickHandler(point);

	return;
}

function UICheckBoxCreator(w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg) {
	var args = ["ui-checkbox", "ui-checkbox", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICheckBox();
		return g.initUICheckBox(this.type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg);
	}
	
	return;
}

