import moment from "moment";

export default class Comment {
  constructor(data) {
    this.id = data.id;
    this.text = data.comment;
    this.date = data.date;
    this.author = data.author;
    this.emoji = data.emotion;
  }

  toRAW() {
    return {

    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static cloneData(data) {
    return new Movie(data.toRAW());
  }
}
