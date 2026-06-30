"""立体拼豆网站端到端验证脚本"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = "http://localhost:5173/"
SHOTS = Path(__file__).parent / "screenshots"
SHOTS.mkdir(exist_ok=True)

results = []
def ok(name, detail=""):
    results.append(("PASS", name, detail))
def fail(name, detail=""):
    results.append(("FAIL", name, detail))

console_msgs = []
page_errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    page.on("console", lambda msg: console_msgs.append((msg.type, msg.text)))
    page.on("pageerror", lambda err: page_errors.append(str(err)))

    # 1. 加载页面
    try:
        page.goto(URL, wait_until="networkidle", timeout=20000)
        ok("页面加载", "networkidle")
    except Exception as e:
        fail("页面加载", str(e))
        browser.close()
        sys.exit(1)

    page.wait_for_timeout(1000)
    page.screenshot(path=str(SHOTS / "01_initial.png"), full_page=False)

    # 2. 标题
    title_text = page.locator("h1").first.inner_text()
    if "立体拼豆" in title_text:
        ok("标题", title_text)
    else:
        fail("标题", f"得到: {title_text}")

    # 3. Tab 按钮
    tabs = page.get_by_role("button").all_inner_texts()
    if "建模" in tabs and "图纸" in tabs:
        ok("Tab按钮", str(tabs))
    else:
        fail("Tab按钮", str(tabs))

    # 4. Canvas 存在
    canvas = page.locator("canvas")
    canvas_count = canvas.count()
    if canvas_count > 0:
        ok("Canvas渲染", f"找到 {canvas_count} 个 canvas")
    else:
        fail("Canvas渲染", "未找到 canvas")

    # 5. 调色板色块
    color_blocks = page.locator("button[title]").count()
    if color_blocks >= 20:
        ok("调色板", f"{color_blocks} 个色块")
    else:
        fail("调色板", f"仅 {color_blocks} 个色块")

    # 6. 放置拼豆:点击 Canvas 中心区域多次
    box = canvas.first.bounding_box()
    if box:
        cx = box["x"] + box["width"] * 0.5
        cy = box["y"] + box["height"] * 0.55
        for i in range(5):
            page.mouse.click(cx + i * 5, cy + i * 3)
            page.wait_for_timeout(150)
        page.wait_for_timeout(500)
        ok("点击Canvas", "已点击 5 次")

    # 7. 检查 localStorage
    storage = page.evaluate("localStorage.getItem('perler-bead-3d:model')")
    if storage:
        import json
        try:
            data = json.loads(storage)
            beads = data.get("beads", [])
            if len(beads) > 0:
                ok("放置拼豆+持久化", f"localStorage 中有 {len(beads)} 颗拼豆")
            else:
                fail("放置拼豆", "localStorage beads 为空(可能点击未命中网格)")
        except Exception as e:
            fail("localStorage解析", str(e))
    else:
        fail("localStorage", "未找到 model 键")

    page.screenshot(path=str(SHOTS / "02_after_place.png"))

    # 8. 切换到图纸模式
    page.get_by_role("button", name="图纸", exact=True).click()
    page.wait_for_timeout(800)
    page.screenshot(path=str(SHOTS / "03_blueprint.png"))

    # 图纸模式应显示层信息或统计
    body_text = page.locator("body").inner_text()
    if "层" in body_text or "统计" in body_text:
        ok("图纸模式", "显示层/统计信息")
    else:
        fail("图纸模式", f"未显示图纸信息,正文: {body_text[:200]}")

    # 9. 颜色统计
    if "统计" in body_text or "总数" in body_text or "×" in body_text:
        ok("颜色统计", "存在统计内容")
    else:
        fail("颜色统计", "未找到统计内容")

    # 10. 返回建模
    ret_btn = page.get_by_role("button", name="返回建模")
    if ret_btn.count() > 0:
        ret_btn.click()
        page.wait_for_timeout(500)
        ok("返回建模", "按钮存在并点击")
    else:
        # 也许通过 Tab 切换
        page.get_by_role("button", name="建模", exact=True).click()
        page.wait_for_timeout(500)
        ok("返回建模", "通过 Tab 切换")

    # 11. 页面错误检查
    if page_errors:
        fail("页面运行时错误", "; ".join(page_errors[:3]))
    else:
        ok("页面运行时错误", "无")

    # console 错误(忽略 favicon 404 等)
    real_errors = [m for t, m in console_msgs if t == "error" and "favicon" not in m.lower()]
    if real_errors:
        fail("console错误", "; ".join(real_errors[:3]))
    else:
        ok("console错误", "无(忽略 favicon)")

    browser.close()

# 输出报告
print("\n" + "=" * 60)
print("验证报告")
print("=" * 60)
npass = sum(1 for r in results if r[0] == "PASS")
nfail = sum(1 for r in results if r[0] == "FAIL")
for status, name, detail in results:
    mark = "✓" if status == "PASS" else "✗"
    print(f"{mark} [{status}] {name}: {detail}")
print("=" * 60)
print(f"通过 {npass} / 失败 {nfail} / 总计 {len(results)}")
sys.exit(0 if nfail == 0 else 1)
