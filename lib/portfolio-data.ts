/*
 * Brandingo portfolio — real design work, grouped by the type of design
 * (the same way the studio showcases its work). Images live in
 * /public/Stationary Design/<folder>.
 */

export interface PortfolioItem {
  id: string;
  category: string;
  image: string;
}

const B = "/Stationary Design";

// category → list of image paths (client's actual work samples)
const groups: Record<string, string[]> = {
  "Logo": [
    `${B}/Logo/001.jpeg`,
    `${B}/Logo/002.jpeg`,
    `${B}/Logo/003.jpeg`,
    `${B}/Logo/0010.jpeg`,
    `${B}/Logo/0011.jpeg`,
    `${B}/Logo/0012.jpeg`,
    `${B}/Logo/0013.jpeg`,
    `${B}/Logo/0014.jpeg`,
    `${B}/Logo/0015.jpeg`,
  ],
  "Banner & Standee": [
    `${B}/banner design/Banner1.jpeg`,
    `${B}/banner design/Banner2.jpeg`,
    `${B}/banner design/Banner3.jpeg`,
    `${B}/banner design/Banner5.jpeg`,
    `${B}/banner design/Banner7.jpg`,
    `${B}/banner design/Banner8.jpg`,
  ],
  "Brochure": [
    `${B}/Brouchers & File/001.jpg`,
    `${B}/Brouchers & File/002.jpeg`,
    `${B}/Brouchers & File/003.jpeg`,
    `${B}/Brouchers & File/0011.jpeg`,
    `${B}/Brouchers & File/0013.jpg`,
    `${B}/Brouchers & File/0014.jpeg`,
    `${B}/Brouchers & File/0016.jpeg`,
  ],
  "Packaging": [
    `${B}/packaging/10.jpeg`,
    `${B}/packaging/11.jpg`,
    `${B}/packaging/13.jpeg`,
    `${B}/packaging/16.jpeg`,
    `${B}/packaging/18.jpeg`,
    `${B}/packaging/00e4f642-160b-48db-a900-9f6e46defb31.jpg`,
    `${B}/packaging/0e07f956-1776-4e9d-9231-fc911bedb615.jpg`,
  ],
  "Stationery": [
    `${B}/Stationary Design/001.jpeg`,
    `${B}/Stationary Design/002.jpeg`,
    `${B}/Stationary Design/004.jpeg`,
    `${B}/Stationary Design/005.jpeg`,
    `${B}/Stationary Design/006.jpeg`,
    `${B}/Stationary Design/007.jpeg`,
    `${B}/Stationary Design/008.jpeg`,
    `${B}/Stationary Design/009.jpeg`,
  ],
  "Social Media": [
    `${B}/Social Media Post/grid_poster_11-05.png`,
    `${B}/Social Media Post/RMG Hiring.jpeg`,
    `${B}/Social Media Post/Swarit Elect.jpeg`,
    `${B}/Social Media Post/HOME 006-03.jpg`,
    `${B}/Social Media Post/WhatsApp Image 2026-05-09 at 10.42.43 AM.jpeg`,
  ],
  "Menu": [
    `${B}/menu/006.jpeg`,
    `${B}/menu/007.jpeg`,
    `${B}/menu/008.jpeg`,
    `${B}/menu/009.jpeg`,
    `${B}/menu/5.jpeg`,
    `${B}/menu/22abc10e-7fe9-47e9-afde-66b23649dca5.jpg`,
  ],
  "Flyer": [
    `${B}/Flyer Design/0018.jpeg`,
    `${B}/Flyer Design/0019.jpeg`,
    `${B}/Flyer Design/0020.jpeg`,
    `${B}/Flyer Design/0021.jpeg`,
    `${B}/Flyer Design/0022.jpeg`,
    `${B}/Flyer Design/0023.jpeg`,
    `${B}/Flyer Design/0026.jpeg`,
  ],
  "Invitation": [
    `${B}/invtations/00b00e3b-0acd-4b3b-9af0-8c57be93ebbd.jpg`,
    `${B}/invtations/06dd1cb4-20a9-4955-9c64-12960fb781cb.jpg`,
    `${B}/invtations/17476ecc-0f75-4d03-b125-48839fee5cdc.jpg`,
    `${B}/invtations/1d1e40ae-ce91-4086-90a5-5b8b28b879e4.jpg`,
    `${B}/invtations/310ac3d1-96fa-479e-b791-74443b2e993d.jpg`,
    `${B}/invtations/433087ee-31fc-4d76-8d10-a572809406a6.jpg`,
    `${B}/invtations/4426df03-33bb-416e-acf5-2a2658f805ec.jpg`,
  ],
  "Label & Tag": [
    `${B}/tag design/a05665c2-b65d-4329-8476-5212f02a5f1b.jpg`,
    `${B}/tag design/cf1415eb-6277-4e47-a503-e1c074aad145.jpg`,
    `${B}/tag design/WhatsApp Image 2026-04-09 at 12.03.20.jpeg`,
  ],
  "Bag": [
    `${B}/Bag Design/0b62f83c-13c9-4788-8ae8-9ef59b9258a9.jpg`,
    `${B}/Bag Design/1d6d067c-920a-4729-bd44-f38e1b29370b.jpg`,
    `${B}/Bag Design/2f385020-020d-49a7-88f5-7d63b11b91d0.jpg`,
    `${B}/Bag Design/44cb8c43-f272-4e86-ab6a-6b6f000e4991.jpg`,
    `${B}/Bag Design/4594d9ad-7ee4-4135-8cc3-4beb1a314009.jpg`,
    `${B}/Bag Design/7d397ec4-01c4-416e-9a8a-8c96da387090.jpg`,
  ],
  "ID Card": [
    `${B}/id card/03391698-0681-40ec-8f27-05e08ee51cf0.jpg`,
    `${B}/id card/210df14f-624f-4652-8518-f76bf4b6795a.jpg`,
    `${B}/id card/3831181c-9da8-45a2-9429-4d5539720b2a.jpg`,
    `${B}/id card/3b746b3f-6e53-477c-9503-c1dc0445f9bd.jpg`,
    `${B}/id card/703bd4fe-55d4-49ad-bf97-74b53bcb1e60.jpg`,
  ],
};

export const portfolioCategories = ["All", ...Object.keys(groups)];

export const portfolioItems: PortfolioItem[] = Object.entries(groups).flatMap(
  ([category, imgs]) => imgs.map((image, i) => ({ id: `${category}-${i}`, category, image }))
);
