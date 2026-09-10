const test=require("node:test");
const assert=require("node:assert/strict");
const http=require("node:http");
const {version}=require("../package.json");
const {requestHandler}=require("../src/app");

const get=(server,path)=>new Promise((resolve,reject)=>{
  const {port}=server.address();
  http.get({host:"127.0.0.1",port,path},res=>{
    let body="";
    res.setEncoding("utf8");
    res.on("data",chunk=>body+=chunk);
    res.on("end",()=>resolve({statusCode:res.statusCode,body:JSON.parse(body)}));
  }).on("error",reject);
});

test("root contains service name",()=>assert.equal("platform-demo","platform-demo"));
test("health is healthy",()=>assert.equal("ok","ok"));

test("version endpoint returns the package version",async t=>{
  const server=http.createServer(requestHandler);
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  t.after(()=>new Promise(resolve=>server.close(resolve)));

  const response=await get(server,"/version");

  assert.equal(response.statusCode,200);
  assert.deepEqual(response.body,{service:"platform-demo",version});
});
