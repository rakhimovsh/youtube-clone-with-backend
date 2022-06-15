import { read, write } from "../utils/model.js";
import {
  UploadedTypeError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors.js";
import path from "path";

function GET(req, res, next) {
  try {
    const videos = read("videos");
    const users = read("users");
    let { userId, search } = req.query;
    if (req.url == "/admin/video") userId = req.userId;

    let filtredVideos = videos.filter((video) => {
      let byuserId = userId ? userId == video.userId : true;
      let bySearch = search
        ? video.videoTitle.toUpperCase().includes(search.toUpperCase())
        : true;

      video.user = users.find((user) => user.userId == video.userId);

      delete video.userId;
      delete video.user.password;

      return byuserId && bySearch;
    });

    res.status(201).send({
      status: 201,
      message: "",
      data: filtredVideos,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}

function POST(req, res, next) {
  try {
    let videos = read("videos");
    let users = read("users");
    let newVideo = req.file;
    let findUser = users.find((user) => user.userId == req.body.userId);
    if (newVideo.mimetype.split("/")[0] != "video")
      return next(
        new UploadedTypeError(415, "The uploaded file must be video")
      );
    if (!findUser) return next(new NotFoundError(404, "User not found"));
    req.body.videoId = videos.length
      ? videos[videos.length - 1].videoId + 1
      : 1;
    req.body.videoDate = Date.now();
    req.body.download = "/download/" + newVideo.filename;
    req.body.view = "/" + newVideo.filename;
    req.body.size = newVideo.size;
    req.body.userId = Number(req.body.userId);
    videos.push(req.body);
    write("videos", videos);
    return res.status(201).send({
      status: 201,
      message: "The video was uploaded successfully",
      data: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
function DOWNLOAD(req, res, next) {
  let { videoName } = req.params;
  if (!videoName) res.send("video not found");
  res.download(path.join(process.cwd(), "uploads", videoName));
}
function DELETE(req, res, next) {
  try {
    let { videoId } = req.params;
    videoId = +videoId;
    const videos = read("videos");
    let findVideo = videos.find((v) => v.videoId == videoId);
    if (!findVideo) return next(new NotFoundError(404, "Video not found"));
    let filteredVidoes = videos.filter((v) => v.videoId != videoId);
    write("videos", filteredVidoes);
    res.status(201).send({
      status: 201,
      message: "Video deleted successfully",
      data: findVideo,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
export default {
  GET,
  POST,
  DOWNLOAD,
  DELETE,
};
