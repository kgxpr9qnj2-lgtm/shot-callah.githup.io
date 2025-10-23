import type { ElementGroupings } from '../types';
import { elements } from './elements';

const getElementsBy = (filter: (el: typeof elements[0]) => boolean): string[] => {
  return elements.filter(filter).map(el => el.symbol);
};

export const elementGroupings: ElementGroupings = {
  "nonmetals": {
    "description": "Elements classified as nonmetals, excluding halogens and noble gases.",
    "elements": getElementsBy(el => el.category === "Nonmetal")
  },
  "metalloids": {
    "description": "Elements with properties intermediate between metals and nonmetals.",
    "elements": getElementsBy(el => el.category === "Metalloid")
  },
  "s-block": {
    "description": "Elements where the highest-energy electron occupies an s-orbital.",
    "elements": getElementsBy(el => el.block === "s")
  },
  "p-block": {
    "description": "Elements where the highest-energy electron occupies a p-orbital.",
    "elements": getElementsBy(el => el.block === "p")
  },
  "d-block": {
    "description": "Elements where the highest-energy electron occupies a d-orbital, also known as transition metals.",
    "elements": getElementsBy(el => el.block === "d")
  },
  "f-block": {
    "description": "Elements where the highest-energy electron occupies an f-orbital, including Lanthanides and Actinides.",
    "elements": getElementsBy(el => el.block === "f")
  },
  "alkali_metals": {
    "description": "Group 1 elements (excluding Hydrogen), highly reactive metals with one valence electron.",
    "elements": getElementsBy(el => el.category === "Alkali Metal")
  },
  "alkaline_earth_metals": {
    "description": "Group 2 elements, reactive metals with two valence electrons.",
    "elements": getElementsBy(el => el.category === "Alkaline Earth Metal")
  },
  "transition_metals": {
    "description": "Elements in groups 3-12, characterized by having partially filled d-orbitals.",
    "elements": getElementsBy(el => el.category === "Transition Metal")
  },
  "post_transition_metals": {
    "description": "Metals to the right of the transition elements.",
    "elements": getElementsBy(el => el.category === "Post-transition Metal")
  },
  "lanthanides": {
    "description": "The f-block elements from period 6, also known as rare-earth elements.",
    "elements": getElementsBy(el => el.category === "Lanthanide")
  },
  "actinides": {
    "description": "The f-block elements from period 7, all of which are radioactive.",
    "elements": getElementsBy(el => el.category === "Actinide")
  },
  "halogens": {
    "description": "Group 17 elements, highly reactive nonmetals that form salts.",
    "elements": getElementsBy(el => el.category === "Halogen")
  },
  "noble_gases": {
    "description": "Group 18 elements, generally inert gases with a full outer electron shell.",
    "elements": getElementsBy(el => el.category === "Noble Gas")
  },
  ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => i + 1).map(groupNum => [
    `group_${groupNum}`,
    {
      "description": `Elements belonging to Group ${groupNum}.`,
      "elements": getElementsBy(el => el.group === groupNum)
    }
  ])),
  ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => i + 1).map(valence => [
    `valence_${valence}`,
    {
      "description": `Elements with ${valence} valence electron(s).`,
      "elements": getElementsBy(el => el.valenceElectrons === valence)
    }
  ])),
  // Main Groups for corrected highlighting logic based on user image
  "main_group_1": { "description": "Main Group 1", "elements": getElementsBy(el => el.group === 1) },
  "main_group_2": { "description": "Main Group 2", "elements": getElementsBy(el => el.group === 2) },
  "main_group_3": { "description": "Main Group 3 (Group 13)", "elements": getElementsBy(el => el.group === 13) },
  "main_group_4": { "description": "Main Group 4 (Group 14)", "elements": getElementsBy(el => el.group === 14) },
  "main_group_5": { "description": "Main Group 5 (Group 15)", "elements": getElementsBy(el => el.group === 15) },
  "main_group_6": { "description": "Main Group 6 (Group 16)", "elements": getElementsBy(el => el.group === 16) },
  "main_group_7": { "description": "Main Group 7 (Group 17)", "elements": getElementsBy(el => el.group === 17) },
  "main_group_8": { "description": "Main Group 8 (Group 18)", "elements": getElementsBy(el => el.group === 18) },
};
