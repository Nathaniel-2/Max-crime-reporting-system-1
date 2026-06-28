import fs from 'node:fs';

const path = 'src/app/pages/LandingPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'import { Button, AstraLogo } from "@figma/astraui";',
  'import { Button } from "@figma/astraui";\nimport { NigerianFlag } from "../components/NigerianFlag";'
);
content = content.replace(/<AstraLogo[^>]*>/g, '<NigerianFlag size={64} className="rounded-sm" />');
content = content.replace(/Astra Secure City Portal/g, 'Nigeria Police Force Portal');
content = content.replace(/Astra Secure City/g, 'Nigeria Police Force');

fs.writeFileSync(path, content);

const authPath = 'src/app/pages/Auth.tsx';
let authContent = fs.readFileSync(authPath, 'utf8');
authContent = authContent.replace(
  'import { Button, InputField, AstraLogo, Checkbox } from "@figma/astraui";',
  'import { Button, InputField, Checkbox } from "@figma/astraui";\nimport { NigerianFlag } from "../components/NigerianFlag";'
);
authContent = authContent.replace(/<AstraLogo[^>]*>/g, '<NigerianFlag size={48} className="rounded-sm shadow-sm" />');
authContent = authContent.replace(/Astra Secure City/g, 'Nigeria Police Force');
fs.writeFileSync(authPath, authContent);
