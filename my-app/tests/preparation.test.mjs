import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBS,LEAGUES,COUNTRIES } from '../src/data/clubs.js';
import { FORMATIONS,makeSquad,autoLineup,getTactics,makeFixtures,formatDate,getReadiness } from '../src/data/football.js';
import { normalizeWorkspace,parseCareerBackup } from '../src/data/persistence.js';
import { AVATARS,getAvatarById,ENV } from '../src/data/assets.js';
import { existsSync } from 'node:fs';
test('94 unique clubs belong to valid curated collections',()=>{
  assert.equal(CLUBS.length,94);assert.equal(new Set(CLUBS.map(c=>c.id)).size,94);
  for(const c of CLUBS){assert.ok(LEAGUES.some(l=>l.id===c.leagueId&&l.countryId===c.countryId));assert.ok(COUNTRIES.some(n=>n.id===c.countryId));}
});
test('every club and formation produces eleven unique players and a goalkeeper in goal',()=>{
  for(const club of CLUBS){
    const squad=makeSquad(club.id);assert.equal(squad.length,24);assert.equal(new Set(squad.map(p=>p.id)).size,24);
    assert.deepEqual(squad,makeSquad(club.id));
    for(const formation of Object.keys(FORMATIONS))for(const priority of ['balanced','fitness','youth']){
      const lineup=autoLineup(squad,formation,priority);assert.equal(Object.keys(lineup).length,11);assert.equal(new Set(Object.values(lineup)).size,11);
      assert.equal(squad.find(p=>p.id===lineup[10]).pos,'GK');
      for(let i=0;i<10;i++)assert.notEqual(squad.find(p=>p.id===lineup[i]).pos,'GK');
    }
  }
});
test('invalid saved lineups recover without duplicate players',()=>{
  const squad=makeSquad('pirates'),workspace={tactics:{formation:'4-4-2',lineup:{0:'missing',1:squad[1].id,10:squad[5].id}}};
  const tactic=getTactics(workspace,squad,'balanced');assert.equal(new Set(Object.values(tactic.lineup)).size,11);assert.equal(squad.find(p=>p.id===tactic.lineup[10]).pos,'GK');
});
test('each illustrative league opponent has a home and away fixture, with ordered dates',()=>{
  for(const club of CLUBS){
    const fixtures=makeFixtures(club),league=fixtures.filter(f=>f.type==='League'),rivals=CLUBS.filter(c=>c.leagueId===club.leagueId&&c.id!==club.id);
    assert.equal(fixtures.filter(f=>f.type==='Friendly').length,3);
    assert.equal(league.length,rivals.length*2);assert.equal(new Set(fixtures.map(f=>f.id)).size,fixtures.length);
    for(let i=0;i<fixtures.length;i++){assert.notEqual(fixtures[i].opponentId,club.id);assert.ok(CLUBS.some(c=>c.id===fixtures[i].opponentId));if(i)assert.ok(fixtures[i].date>fixtures[i-1].date);}
    for(const rival of rivals){const pair=league.filter(f=>f.opponentId===rival.id);assert.equal(pair.length,2);assert.equal(pair.filter(f=>f.home).length,1);}
  }
});
test('save import validates careers, preserves preparation and rejects duplicates',()=>{
  const career={id:'example',name:'A saved story',clubId:'pirates',workspace:{sessions:['Rest','Recovery','Ball retention','Attacking movement','Set pieces','Match preparation'],notes:[{id:'note',title:'Plan',body:'Keep the width',category:'Tactics',createdAt:1}],briefingComplete:true,shortlist:['one','one']}};
  const [restored]=parseCareerBackup(JSON.parse(JSON.stringify({careers:[career]})));
  assert.equal(restored.workspace.sessions.length,6);assert.equal(restored.workspace.notes[0].body,'Keep the width');assert.deepEqual(restored.workspace.shortlist,['one']);
  assert.throws(()=>parseCareerBackup({careers:[career,career]}));assert.throws(()=>parseCareerBackup({careers:[{...career,clubId:'missing'}]}));
  assert.deepEqual(normalizeWorkspace('broken'),{});assert.equal(normalizeWorkspace({sessions:'broken'}).sessions,undefined);
});
test('readiness and date preferences reflect the stored choices',()=>{
  assert.equal(getReadiness({}),0);assert.equal(getReadiness({tactics:{},sessions:[],reviewedFixtures:['a'],briefingComplete:true}),100);
  assert.match(formatDate('2026-07-11',{dateFormat:'day-first'}),/11 Jul/);assert.match(formatDate('2026-07-11',{dateFormat:'month-first'}),/Jul 11/);
});
test('all optimized image paths exist and legacy portrait IDs resolve',()=>{
  assert.equal(AVATARS.length,5);assert.equal(new Set(AVATARS.map(a=>a.src)).size,5);
  for(const path of [...Object.values(ENV),...AVATARS.map(a=>a.src)])assert.ok(existsSync(new URL('../public'+path,import.meta.url)));
  assert.ok(getAvatarById('avatar-d'));assert.ok(getAvatarById('avatar-f'));assert.ok(getAvatarById('unknown'));
});
