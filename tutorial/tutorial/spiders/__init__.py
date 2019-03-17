# This package will contain the spiders of your Scrapy project
#
# Please refer to the documentation for information on how to create and manage
# your spiders.
# Match the class="external-menu js-external-menu"
# Xpath to menu: //*[@id="super-container"]/div/div/div[2]/div[1]/div[1]/ul/li[2]/div[2]/b/a
#                //*[@id="super-container"]/div/div/div[2]/div[1]/div[1]/ul/li[2]/div[2]/b/a
#                //*[@id="super-container"]/div/div/div[2]/div[1]/div[2]/ul/li[2]/div[2]/b/a
# response.css('')
# .css(.external-menu)

import scrapy


class MenuSpider(scrapy.Spider):
    name = "menus"

    # Get the urls passed by the call to this spider
    def __init__(self, *args, **kwargs):
      super().__init__(*args, **kwargs)
      self.start_urls = [kwargs.get('start_url')]

    def start_requests(self):
        for url in urls:
            yield scrapy.Request(url=self.start_urls, callback=self.parse)

    # Parse the yelp restaurant page.
    # Get the full menu url
    def parse(self, response):
        elem = response.css('.external-menu::href').get()
        self.log(elem)
        self.log('Gathered url')


class MenuItemsSpider(scrapy.Spider):
    name = "menu_items"

    # Get the urls passed by the call to this spider
    def __init__(self, *args, **kwargs):
      super().__init__(*args, **kwargs)
      self.start_urls = [kwargs.get('start_url')]

    def start_requests(self):
        for url in urls:
            yield scrapy.Request(url=self.start_urls, callback=self.parse)

    # Parse the yelp restaurant page.
    # Get the full menu url
    def parse(self, response):
        elem = response.css('.external-menu::href').get()
        self.log(elem)
        self.log('Gathered url')
