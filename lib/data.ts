// =============================================================================
// lib/data.ts — Central data file for the Stark Lab website
// All site content is defined here. Edit placeholders marked with [BRACKETS].
// =============================================================================

// ---------------------------------------------------------------------------
// Lab Info
// ---------------------------------------------------------------------------
export const labInfo = {
  name: "Stark Lab",
  tagline: "Decoding the Regulatory Genome | Dissecting Mechanisms of Transcription | Discovering Pathogen Effector Functions",
  institution: "Research Institute of Molecular Pathology",
  department: "",
  address: "Vienna Biocenter 1",
  city: "Vienna",
  postalCode: "1030",
  country: "Austria",
  email: "stark@starklab.org",
  phone: "",
  piName: "Alexander Stark",
  piTitle: "",
  // Google Scholar profile of the lab / PI — shown on the Publications page
  scholarUrl: "https://scholar.google.com/citations?user=KDpXSRUAAAAJ&hl=en&oi=ao",

  // Institution logos shown in the footer. Leave the url empty ("") to show an
  // empty logo slot instead, or add/remove entries as needed.
  institutionLogos: [
    {
      name: "IMP — Research Institute of Molecular Pathology",
      url: "/IMP_logo.png",
      href: "https://www.imp.ac.at/",
    },
    {
      name: "Vienna BioCenter",
      url: "/VBC_logo.png",
      href: "https://viennabiocenter.org/",
    },
  ],
  // Longer lab descriptions, kept here for reuse in text you may want to add
  aboutText:
    "",
};

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Members", href: "/members" },
  { label: "Events", href: "/events" },
  { label: "Publications", href: "/publications" },
  { label: "Journal Club", href: "/journal-club" },
  { label: "Vacancies", href: "/vacancies" },
  { label: "Contact", href: "/contact" },
];

// ---------------------------------------------------------------------------
// Research Areas
// ---------------------------------------------------------------------------
export interface ResearchArea {
  id: string;
  title: string;
  summary: string;
  description: string;
  icon: string; // lucide-react icon name
}

export const researchAreas: ResearchArea[] = [
  {
    id: "ai-cis-regulatory",
    title: "AI & Cis-Regulatory Logic",
    summary:
      "We use machine learning to decode the cis-regulatory code of the genome.",
    description:
      "Enhancers are regulatory DNA elements that can drive the expression of their target genes in a highly cell type-specific manner. It is well known that this cell type-specificity is encoded in the enhancer’s DNA sequences in the form of binding motifs for trans-regulatory transcription factors. However, complex spacing and syntax rules can govern enhancer activity, which is why decoding enhancer activity directly from DNA sequences has long been an unsolved task.\n\nIn the Stark lab, we are using deep learning-based approaches for modelling enhancer activity directly from sequence. Once trained, these models can be used for dissecting the regulatory logic of cell types as well as designing synthetic cell type-specific enhancers, holding promise for a wide range of biomedical applications.\n\n{{youtube:pKoEYeFvol4:8}}\n\nIn recent years, we have pioneered the design and validation of synthetic enhancers in cell culture [(de Almeida et al., 2022)](https://www.nature.com/articles/s41588-022-01048-5) and in vivo, both in the fruit fly [(de Almeida et al., 2023)](https://www.nature.com/articles/s41586-023-06905-9) and in the mouse [(Chen & Loubiere et al., 2026)](https://www.nature.com/articles/s41588-026-02729-1).\n\n![Using computational models of regulatory sequences for de novo design of synthetic enhancers active in various mouse tissues (Chen & Loubiere et al., 2026). (a) Computational models of cell type-specific enhancer activity are trained on DNA accessibility and functional enhancer activity data using a transfer learning approach. (b-d) Computationally designed synthetic enhancers validated in various tissues of developing mouse embryos.](/images/research/CompBio.png)",
    icon: "BrainCircuit",
  },
  {
    id: "transcription-regulation",
    title: "Mechanisms of Transcriptional Regulation",
    summary:
      "We use interdisciplinary approaches to unravel mechanisms of transcriptional regulation at the molecular scale.",
    description:
      "Transcription is regulated by transcription factors and cofactors that interact with DNA regulatory elements such as promoters and enhancers. These factors influence the recruitment and activation of RNA polymerase, as well as chromatin structure. Much of our molecular understanding of transcription comes from studies of model promoters containing a TATA-box motif. However, more than 80% of promoters in the human genome lack a TATA box, yet the factors and mechanisms regulating transcription at these promoters remain underexplored. In the Stark lab, we aim to systematically address these questions and define the mechanisms of transcriptional regulation in molecular detail.\n\nTo do this, we take an interdisciplinary approach that combines genetic screening, functional genomics, biochemistry, proteomics, structural biology, and synthetic biology. We use a broad range of cutting-edge technologies and actively develop new methods to enable further discoveries.\n\nPreviously, we identified multiple examples of promoter- and enhancer-type-specific regulation in Drosophila, mouse, and human cells. For example, we showed that distinct types of human enhancers require different cofactors for activation [(Neumayr, Haberle et al., 2022)](https://doi.org/10.1038/s41586-022-04779-x). Similarly, housekeeping and developmental enhancers in Drosophila can be repressed only by specific repressor proteins [(Jacobs et al., 2023)](https://www.science.org/doi/10.1126/science.adf6149).\n\n![**Differential requirements of cofactor proteins for enhancer function** (Neumayr, Haberle et al., 2022).\n**a)** Schematic of the experimental approach. HCT116 cells with a COF of interest tagged by an AID were transfected with a genome-wide STARR-seq library and treated with either IAA to degrade the COF or with a mock control. Enhancer activity across the entire human genome was quantified in the two conditions by sequencing and mapping reporter transcripts. **b)** Effects of COF depletion on enhancer activity.](/images/research/Neumayr2022.png)\n\nWe also developed screening methods such as [TAD-seq](/publications/Arnold2018) and [ORFtag](/publications/Nemcko2024), which enabled the discovery of new activator and repressor proteins. Notably, we identified HCFC1 as a CGI-promoter-specific regulator and, using functional and biochemical assays, described the molecular mechanisms underlying its function [(Nemčko, Sabath et al., 2026)](/publications/Nemcko2025).\n\n![**Use of ORFtag for functional screening.**\n **a** Overview of the ORFtag approach. MOI, multiplicity of infection; Pstrong, strong promoter. **b** Schematic view of three different screens for transcriptional activators (green), repressors (blue) or PTGRs (yellow). eGFP, enhanced GFP; Pmin, minimal promoter. **c** Genome browser screenshots of ORFtag integration sites (vertical lines) in positive (+; top) or negative (–; bottom) strand direction, before (background; gray) and after FACS selection at the genomic locus of each activator (Yap1; green), repressor (Zfp57; blue) and PTGR (Cnot9; yellow) hit emerging from ORFtag screens in mES cells. The log2 odds ratio (log2OR) and FDR are indicated.](/images/research/Nemcko2022.png)",
    icon: "Dna",
  },
  {
    id: "pathogen-effectors",
    title: "Pathogen Effectors",
    summary:
      "We uncover effector functions and mechanisms that shape host–pathogen interactions.",
    description:
      "Pathogen effectors are proteins that alter host cell processes to support infection, immune evasion, and transmission. However, the vast majority of viral, bacterial, and parasitic effector proteins have no known function. To address this major knowledge gap, in collaboration with the groups of [Mikko Taipale (University of Toronto)](https://taipalelab.org/) and [Josef Penninger (Helmholtz Centre for Infection Research (HZI))](https://www.oeaw.ac.at/imba/research/josef-penninger), we built a collection of approximately 10,000 effector ORFs (eORFeome) from diverse human pathogens. By profiling these pathogen proteins in parallel across human cellular pathways, the platform makes it possible to investigate pathogen effectors at a scale that has not been possible before. This work offers opportunities to discover unique protein functions and molecular mechanisms, understand how pathogens access and control host regulatory networks, and establish a systematic foundation for functional annotation of uncharacterized ORFs. The initial functional screening using the first version of the eORFeome demonstrated the power to discover novel pathogen effector proteins affecting different cellular pathways in human cells [(Pachano et al., 2026)](https://www.cell.com/cell/fulltext/S0092-8674(26)00704-X). \n\n![**The eORFeome 1.0 functional genomics platform.** **(Top)** Effector open reading frames (~4,000) from ~250 human pathogens, including viruses, bacteria, and eukaryotic parasites, were collected and cloned into a pooled lentiviral expression library, which was transduced into human cells for pooled screening. **(Middle)** The library was screened across five human cellular pathways: NF-κB signalling, measured with an NF-κB response-element GFP reporter; p53 activity, measured with a p53 response-element mCherry reporter; apoptosis; STING signalling, measured as cGAMP-induced expression of the interferon-stimulated gene IFIT; and cell-surface MHC-I levels, measured by antibody staining. **(Bottom)** Mechanisms of four effectors identified in the screens. The *Legionella* effector RavE promotes degradation of RIPK1 at the TNFα receptor signalling complex (TRADD, TRAF, RIPK1). The human herpesvirus 6A protein U14 binds p53 and blocks transcription from p53 response elements. The human herpesvirus 7 protein U21 targets STING for lysosomal degradation. The human adenovirus protein 13.6K inhibits the TAP1/TAP2 peptide transporter, preventing peptide loading onto MHC-I.](/images/publications/Pachano_2026.jpg)",
    icon: "Virus",
  },
];

// ---------------------------------------------------------------------------
// Team Members
// ---------------------------------------------------------------------------
// Role categories used in public/data/members.csv.
// "alumni" is special: it moves a person from the Members page to the Alumni page.
export type MemberCategory =
  | "group-leader"
  | "phd"
  | "postdoc"
  | "research-technician"
  | "master-student"
  | "intern"
  | "alumni";

export interface TeamMember {
  name: string;
  role: string;
  category: MemberCategory;
  nationality: string;
  bio: string;
  email: string;
  scholar: string;
  twitter: string;
  image: string;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
export interface LabEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

// ---------------------------------------------------------------------------
// Publications 
// ---------------------------------------------------------------------------
export interface Publication {
  /** URL-safe id derived from the title — used for the detail page route. */
  slug: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  date: string;
  url: string;
  /** Optional figure shown on the card and on the detail page. */
  image: string;
  /** Optional short summary shown on the detail page. */
  summary: string;
  /** column = the CSV column it came from (e.g. "github"), used to pick the icon. */
  links: { label: string; url: string; column: string }[];
}

/** Turns a publication title into a stable, URL-safe slug. */
export function slugify(input: string): string {
  return (
    (input ?? "")
      ?.toLowerCase?.()
      ?.normalize?.("NFKD")
      ?.replace?.(/[^a-z0-9]+/g, "-")
      ?.replace?.(/^-+|-+$/g, "")
      ?.slice?.(0, 80) ?? ""
  );
}

// ---------------------------------------------------------------------------
// Vacancies / Join Us
// ---------------------------------------------------------------------------
export const vacanciesInfo = {
  headline: "Join Our Research Team",
  intro:
    "We are always looking for talented and motivated scientists to join our interdisciplinary team. We welcome applications from researchers at all career stages who are passionate about gene regulation, computational biology, and host–pathogen biology.",
  positions: [
    {
      title: "Interns and Master's Students",
      description:
        "Short-term internships and thesis projects are available for talented and motivated students. Please reach out to us with your CV and a brief description of your research interests or apply through the VBC Summer School program.",
      applyUrl: "https://training.vbc.ac.at/summer-school/",
      applyLabel: "VBC Summer School",
    },
    {
      title: "PhD Students",
      description:
        "We recruit PhD students through the Vienna BioCenter PhD Program. The program offers competitive funding, world-class training, and an international research environment.",
      applyUrl: "https://training.vbc.ac.at/",
      applyLabel: "VBC PhD Program",
    },
    {
      title: "Postdoctoral Fellows",
      description:
        "We welcome inquiries from highly motivated postdoctoral candidates. To apply or inquire about upcoming opportunities, please get in touch via email with your CV and a brief statement summarising your research interests.",
      applyUrl: "",
      applyLabel: "Contact Us",
    },
  ],
  closingNote:
    `Interested in joining? Send your CV, a brief cover letter describing your research interests, and the names of two references to ${labInfo.email}.`,
};

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
export const contactInfo = {
  heading: "Get in Touch",
  description:
    "Whether you are interested in our research, looking to collaborate, or considering joining the lab — here is how to find us.",
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5319.780800946297!2d16.400439676775196!3d48.18946314754697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d07592c033617%3A0x98ca58fdd12e7bb8!2sVienna%20Biocenter!5e0!3m2!1sen!2sat!4v1786719324994!5m2!1sen!2sat',
  locationLabel: "Vienna Biocenter 1, Vienna, Austria",
  // Section 1 — "Meet us"
  meetUs: {
    heading: "Meet us",
    description:
      "The best way to get to know us is in person, and we are regularly present at conferences and seminars — please reach out!",
  },
  // Section 2 heading — "Contact details + location"
  detailsHeading: "Contact details & location",
};
// ---------------------------------------------------------------------------
// Journal Club
// ---------------------------------------------------------------------------
export const journalClubInfo = {
  heading: "Journal Club",
  description:
    "We meet once a week with Christa Buecker's lab and others to discuss recent literature. Each week, we discuss one main paper in detail and the highlights of a second paper (short paper). We also host a First Author Journal Club that invites the first author(s) of recent papers or preprints to discuss their work.",
  // Optional: a published Google Sheet holding the schedule. Paste either the
  // normal sharing link of the sheet or a "File > Share > Publish to web" CSV
  // link. The sheet is re-read at most every 5 minutes; if Google is
  // unreachable the last successfully loaded copy keeps being shown.
  sheetUrl: "https://docs.google.com/spreadsheets/d/1F_ZDOYd14_4YmBBgXFYkO2UqRG3cO4bqYwwdBbaFVyA/edit?gid=0#gid=0",
  // Entries carrying this tag are highlighted in the list. Matching ignores
  // case and treats spaces, underscores and hyphens as equivalent, so this
  // also matches a "first_author_JC" tag value in the CSV.
  highlightTag: "first_author_JC",
};

// ---------------------------------------------------------------------------
// Page banner images
// ---------------------------------------------------------------------------
// Every page shows an image band of the same dimensions underneath its title
// and description. Paste an image URL (or a path such as
// "/images/pages/research.jpg") for a page to show it; leave the string empty
// to show no image (only the page background) instead.
export const pageImages: Record<string, string> = {
  research: "/images/banners/research.webp",
  members: "/images/banners/members.webp",
  alumni: "",
  events: "/images/banners/events.webp",
  publications: "/images/banners/publications.png",
  "journal-club": "/images/banners/jc.webp",
  vacancies: "/images/banners/vacancies.png",
  contact: "/images/banners/contact.webp",
};

// ---------------------------------------------------------------------------
// PHOTO CREDITS — name of the person who took each banner photo, keyed by the
// same page keys as `pageImages` above. The name shows up (1) as a small
// credit on the banner itself and (2) in the "Banner photography" section of
// the footer. The rights notice ("© <lab name>") is added automatically.
//
// Example:  research: "Jane Doe",
// Leave a page as "" to skip the credit for it.
// ---------------------------------------------------------------------------
export const bannerCredits: Record<string, string> = {
  research: "Lukas Beck",
  members: "Anna Stöcher",
  alumni: "",
  events: "Lukas Beck",
  publications: "Lukas Beck",
  "journal-club": "",
  vacancies: "Lukas Beck",
  contact: "Lukas Beck",
};
