import { inject } from 'aurelia-framework';
import { Spider } from '../models/spider/spider';
import { Router } from 'aurelia-router';

@inject(Spider, Router)
export class SpiderGame {

  constructor(spider, router) {
    this.spider = spider;
    this.router = router;
  }

  activate() {
    this.spider.newGame();
  }

}
