/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://pdflow-utility.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
}
