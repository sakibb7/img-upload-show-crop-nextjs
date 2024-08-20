"use client";

import avatar from "@/public/cool-smiley-profile-picture-6lqzc2aegkuxbini.jpg";

import Image, { StaticImageData } from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENTION = 150;

export default function Home() {
  const [avatarUrl, setAvatarURl] = useState(
    "https://mrwallpaper.com/images/thumbnail/cool-smiley-profile-picture-6lqzc2aegkuxbini.jpg"
  );
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [error, setError] = useState("");

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new window.Image();

      const imageUrl = reader.result?.toString() || "";

      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (evt: Event) => {
        if (error) setError("");

        const { naturalHeight, naturalWidth } = evt.target as HTMLImageElement;
        if (naturalWidth < MIN_DIMENTION || naturalHeight < MIN_DIMENTION) {
          setError("Image must be at least 150 * 150");
          return setImgSrc("");
        }
      });

      setImgSrc(imageUrl);
    });

    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENTION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);

    setCrop(centeredCrop);
  };

  return (
    <main className="flex justify-center items-center h-dvh">
      <div className="">
        <Image
          src={avatarUrl}
          alt=""
          className="rounded-full"
          width={150}
          height={150}
        />
        <label htmlFor="photoUpload" className="cursor-pointer ">
          <p className="py-3 px-5 rounded-full border w-full">Upload File</p>
          <input
            type="file"
            accept="image/*"
            id="photoUpload"
            className="hidden"
            onChange={onSelectFile}
          />
        </label>

        {error && <p className="text-red-600">{error}</p>}

        {imgSrc && (
          <div className="flex flex-col justify-center items-center gap-8">
            <ReactCrop
              crop={crop}
              circularCrop
              keepSelection
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENTION}
              onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            >
              {" "}
              <img
                ref={imgRef}
                src={imgSrc}
                style={{ maxHeight: "70vh", maxWidth: "70vh" }}
                alt=""
                onLoad={onImageLoad}
              />{" "}
            </ReactCrop>

            <button
              className="bg-sky-500 text-white px-5 py-3 rounded-full"
              onClick={() => {
                if (imgRef.current && previewCanvasRef.current) {
                  setCanvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    convertToPixelCrop(
                      crop || {
                        unit: "%",
                        width: 100,
                        height: 100,
                        x: 0,
                        y: 0,
                      },
                      imgRef.current.width,
                      imgRef.current.height
                    )
                  );
                }

                const dataUrl = previewCanvasRef.current?.toDataURL();
                setAvatarURl(dataUrl || "");
              }}
            >
              Crop Image
            </button>
          </div>
        )}

        {crop && (
          <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{
              display: "none",
              border: "1px solid black",
              objectFit: "contain",
              width: 150,
              height: 150,
            }}
          />
        )}
      </div>
    </main>
  );
}
