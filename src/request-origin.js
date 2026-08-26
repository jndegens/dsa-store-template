import {headers} from 'next/headers';

const productionOrigin='https://agents.dropshipacademy.nl';
const productionHost='agents.dropshipacademy.nl';
const localHostPattern=/^(?:localhost|127\.0\.0\.1)(?::\d{1,5})?$/;

function firstHeaderValue(value=''){
 return value.split(',')[0].trim().toLowerCase();
}

export function resolveRequestOrigin(requestHeaders){
 const directHost=firstHeaderValue(requestHeaders.get('host')||'');

 // Only the known production hostname and an actual local development Host are
 // allowed into exported URLs. Forwarded protocol/host values are deliberately
 // ignored so a proxy-header injection can never alter a student's AI prompt.
 if(localHostPattern.test(directHost))return `http://${directHost}`;
 if(directHost===productionHost)return productionOrigin;
 return productionOrigin;
}

export async function getRequestOrigin(){
 const requestHeaders=await headers();
 return resolveRequestOrigin(requestHeaders);
}
