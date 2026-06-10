/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://pdflow.in',
  generateRobotsTxt: true,
  sitemapSize: 7000,
}
