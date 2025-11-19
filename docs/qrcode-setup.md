# 二维码登录功能说明

## 功能概述

平板端和移动端的二维码扫码登录功能已完成，包括：

1. **平板端**: 生成二维码，等待移动端扫码授权
2. **移动端**: 扫描二维码，显示授权页面，确认登录

## 文件结构

### 平板端 (cashier-table2.0)

```
cashier-table2.0/
├── pages/auth/login.vue          # 登录页面（包含二维码登录）
├── api/auth/login.js              # 登录相关 API
├── common/uqrcode.js              # 二维码生成工具
├── store/index.js                 # Vuex store（登录状态管理）
└── utils/dutyHelper.js            # 当班人员工具
```

### 移动端 (znj-app-v2)

```
znj-app-v2/
├── src/pages/index/index.vue              # 首页（扫码入口）
├── src/pages/auth/qrcode-authorize.vue    # 授权页面
├── src/api/auth/login.ts                  # 登录 API
└── src/pages.json                         # 页面配置
```

## API 接口

### 平板端 API (`f:\cashier-table2.0\api\auth\login.js`)

```javascript
export default {
  // 登录（只返回 userId）
  login(data) {
    return uni.$u.http.post('/Login/Login', data)
  },
  
  // 获取用户信息
  getUserInfo(userId) {
    return uni.$u.http.get(`/User/getUserInfo?userId=${userId}`)
  },
  
  // 生成移动端扫码登录二维码
  generateMobileQRCode() {
    return uni.$u.http.post('/Login/GenerateMobileQRCode')
  },
  
  // 检查二维码状态
  checkMobileQRCodeStatus(qrCodeId) {
    return uni.$u.http.get(`/Login/CheckMobileQRCodeStatus?qrCodeId=${qrCodeId}`)
  },
}
```

### 移动端 API (`f:\znj-app-v2\src\api\auth\login.ts`)

```typescript
export default {
  // 授权移动端二维码登录
  async authorizeMobileQRCode(data: { 
    qrCodeId: string; 
    userId: string | number; 
    phone: string 
  }) {
    const requestData = {
      QrCodeId: data.qrCodeId,
      UserId: String(data.userId),
      Phone: data.phone,
    }
    const res = await http.post('/Login/AuthorizeMobileQRCode', requestData)
    return res
  },
  
  // 标记二维码已扫描
  async markQRCodeScanned(qrCodeId: string) {
    const requestData = {
      QrCodeId: qrCodeId,
    }
    const res = await http.post('/Login/MarkQRCodeScanned', requestData)
    return res
  },
}
```

## 后端接口

### C# 后端 (`LoginController.cs`)

需要实现以下接口：

1. **POST /Login/Login** - 登录（返回 userId）
   ```csharp
   [HttpPost("Login")]
   public ApiResult Login(User user)
   {
       var loginResult = userService.Login(user.Phone, user.Password);
       return ApiResult.OK(new { userId = loginResult.Id });
   }
   ```

2. **GET /User/getUserInfo** - 获取用户信息
   ```csharp
   [HttpGet("getUserInfo")]
   public ApiResult GetUserInfo(string userId)
   {
       var userInfo = userService.GetUserById(userId);
       return ApiResult.OK(userInfo);
   }
   ```

3. **POST /Login/GenerateMobileQRCode** - 生成二维码
   ```csharp
   [HttpPost("GenerateMobileQRCode")]
   public IActionResult GenerateMobileQRCode()
   {
       var qrCodeId = Guid.NewGuid().ToString();
       var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
       var qrCodeContent = $"MOBILE_LOGIN:{qrCodeId}:{timestamp}";
       
       // 存储到 Redis，5分钟过期
       var qrCodeData = new {
           status = "pending",
           qrCodeId = qrCodeId,
           createdAt = DateTime.UtcNow
       };
       _redisDb.StringSet($"qrcode:login:{qrCodeId}", 
           JsonConvert.SerializeObject(qrCodeData), 
           TimeSpan.FromMinutes(5));
       
       return Ok(new {
           code = 200,
           data = new {
               qrCodeId = qrCodeId,
               qrCodeContent = qrCodeContent
           }
       });
   }
   ```

4. **GET /Login/CheckMobileQRCodeStatus** - 检查二维码状态
   ```csharp
   [HttpGet("CheckMobileQRCodeStatus")]
   public IActionResult CheckMobileQRCodeStatus(string qrCodeId)
   {
       var redisKey = $"qrcode:login:{qrCodeId}";
       var data = _redisDb.StringGet(redisKey);
       
       if (data.IsNullOrEmpty)
       {
           return Ok(new { code = 404, msg = "二维码已过期" });
       }
       
       var qrCodeData = JsonConvert.DeserializeObject<dynamic>(data);
       return Ok(new {
           code = 200,
           data = qrCodeData
       });
   }
   ```

5. **POST /Login/AuthorizeMobileQRCode** - 授权登录
   ```csharp
   [HttpPost("AuthorizeMobileQRCode")]
   public IActionResult AuthorizeMobileQRCode([FromBody] QRCodeAuthRequest request)
   {
       var redisKey = $"qrcode:login:{request.QrCodeId}";
       var data = _redisDb.StringGet(redisKey);
       
       if (data.IsNullOrEmpty)
       {
           return Ok(new { code = 404, msg = "二维码已过期" });
       }
       
       // 生成 token
       var token = GenerateToken(request.UserId);
       
       // 更新 Redis 数据
       var updatedData = new {
           status = "authorized",
           userId = request.UserId,
           phone = request.Phone,
           token = token,
           authorizedAt = DateTime.UtcNow
       };
       
       TimeSpan? ttl = _redisDb.KeyTimeToLive(redisKey);
       if (ttl.HasValue)
       {
           _redisDb.StringSet(redisKey, 
               JsonConvert.SerializeObject(updatedData), 
               ttl.Value);
       }
       
       return Ok(new {
           code = 200,
           msg = "授权成功"
       });
   }
   ```

## 二维码生成工具

### uqrcode.js

使用在线 API 生成二维码：

```javascript
// 使用方法
const uQRCode = require('../../common/uqrcode.js')

uQRCode.make({
  canvasId: 'qrcode',
  componentInstance: this,
  text: 'MOBILE_LOGIN:uuid:timestamp',
  size: 200,
  margin: 1,
  backgroundColor: '#ffffff',
  foregroundColor: '#000000',
  correctLevel: 'H',
  success: () => {
    console.log('二维码生成成功')
  },
  fail: (err) => {
    console.error('二维码生成失败:', err)
  },
})
```

## 登录流程

### 平板端流程

```
1. 页面加载
   ↓
2. 调用 generateMobileQRCode() 生成二维码
   ↓
3. 使用 uqrcode.js 绘制二维码到 canvas
   ↓
4. 开始轮询 checkMobileQRCodeStatus()（每 2 秒）
   ↓
5. 开始倒计时（300 秒）
   ↓
6. 等待状态变化：
   - pending → 等待扫码
   - scanned → 已扫码，等待授权
   - authorized → 授权成功
   ↓
7. 授权成功后：
   - 保存 token
   - 调用 getUserInfo(userId) 获取用户信息
   - 获取公司信息
   - 获取公司设置
   - 创建当班人员
   - 跳转到首页
```

### 移动端流程

```
1. 点击扫码图标
   ↓
2. 检查登录状态
   ↓
3. 调用 uni.scanCode() 扫描二维码
   ↓
4. 解析二维码内容（MOBILE_LOGIN:qrCodeId:timestamp）
   ↓
5. 跳转到授权页面（带 qrCodeId 参数）
   ↓
6. 授权页面显示：
   - 用户信息
   - 授权说明
   - 同意/拒绝按钮
   ↓
7. 点击"同意授权"：
   - 调用 authorizeMobileQRCode()
   - 传递 { qrCodeId, userId, phone }
   ↓
8. 授权成功：
   - 显示成功提示
   - 2 秒后返回首页
```

## 数据格式

### 二维码内容格式

```
MOBILE_LOGIN:{qrCodeId}:{timestamp}
```

示例：
```
MOBILE_LOGIN:550e8400-e29b-41d4-a716-446655440000:1700123456
```

### Redis 数据格式

Key: `qrcode:login:{qrCodeId}`  
TTL: 5 分钟

**初始状态**:
```json
{
  "status": "pending",
  "qrCodeId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-11-19T12:00:00Z"
}
```

**已扫码**:
```json
{
  "status": "scanned",
  "qrCodeId": "550e8400-e29b-41d4-a716-446655440000",
  "scannedAt": "2024-11-19T12:00:30Z"
}
```

**已授权**:
```json
{
  "status": "authorized",
  "qrCodeId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user123",
  "phone": "13800138000",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "authorizedAt": "2024-11-19T12:00:45Z"
}
```

## 注意事项

1. **二维码过期时间**: 5 分钟（300 秒）
2. **轮询间隔**: 2 秒
3. **字段命名**: 
   - 前端使用 camelCase
   - 后端 C# 使用 PascalCase
   - API 请求时需要转换
4. **userId 类型**: 
   - 后端统一使用 `string` 类型
   - 前端发送时使用 `String()` 转换
5. **Token 存储**: 
   - 平板端: `uni.setStorageSync('token', token)`
   - 移动端: 已在 userStore 中管理

## 测试步骤

1. **平板端**:
   - 打开登录页面
   - 确认自动生成二维码
   - 查看控制台日志

2. **移动端**:
   - 登录移动端应用
   - 点击首页扫码图标
   - 扫描平板端二维码
   - 查看授权页面
   - 点击"同意授权"

3. **平板端验证**:
   - 二维码状态变为"已授权"
   - 自动登录成功
   - 跳转到首页

## 常见问题

### Q: 二维码生成失败？
A: 检查网络连接，确保可以访问 `https://api.qrserver.com`

### Q: 扫码后没有跳转？
A: 检查 `pages.json` 是否正确注册了授权页面，并重新编译项目

### Q: 授权失败？
A: 检查后端接口是否正确实现，查看控制台错误日志

### Q: 二维码一直显示"生成中"？
A: 检查 canvas 元素是否正确渲染，查看 uqrcode.js 的日志输出
