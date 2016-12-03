import $ from 'jquery';

export default class Message {
  constructor(nodes) {
    this.$msg = $('<div id="msg_warning"></div>');
    nodes.forEach((message) => {
      this.$msg.append(`<span>${message}</span>`);
    });
    $('body').append(this.$msg);
  }

  set(nodeId, msg) {
    $(this.$msg.find('span')[nodeId]).html(msg);
  }

  increase(nodeId) {
    let val = $(this.$msg.find('span')[nodeId]).html();
    $(this.$msg.find('span')[nodeId]).html(parseInt(val) + 1);
  }

  close() {
    this.$msg.remove();
  }
}