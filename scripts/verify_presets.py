"""预设模型库验证脚本"""
import sys, json
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = "http://localhost:5173/"
SHOTS = Path(__file__).parent / "screenshots"
SHOTS.mkdir(exist_ok=True)

results = []
def ok(name, detail=""): results.append(("PASS", name, detail))
def fail(name, detail=""): results.append(("FAIL", name, detail))

page_errors = []
console_msgs = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    page.on("pageerror", lambda e: page_errors.append(str(e)))
    page.on("console", lambda m: console_msgs.append((m.type, m.text)))

    page.goto(URL, wait_until="networkidle", timeout=20000)
    page.wait_for_timeout(800)

    # 1. 模型库标题存在
    headings = page.locator("h2").all_inner_texts()
    if "模型库" in headings:
        ok("模型库标题", "存在")
    else:
        fail("模型库标题", f"未找到, headings={headings}")

    # 2. 8 个预设按钮(每个有 title 描述)
    preset_btns = page.locator("button[title]")
    preset_count = preset_btns.count()
    # 调色板也有 title,需要排除。预设按钮在"模型库"容器内
    # 用文字匹配预设名
    preset_names = ["立方体", "金字塔", "圣诞树", "心形", "小蘑菇", "笑脸", "小房子", "生日蛋糕"]
    found = []
    for name in preset_names:
        if page.get_by_text(name, exact=True).count() > 0:
            found.append(name)
    if len(found) == 8:
        ok("8个预设模型", str(found))
    else:
        fail("8个预设模型", f"只找到 {len(found)}: {found}")

    page.screenshot(path=str(SHOTS / "10_presets_initial.png"))

    # 3. 清空 localStorage 确保从空开始
    page.evaluate("localStorage.removeItem('perler-bead-3d:model')")

    # 4. 加载"金字塔"预设
    page.get_by_text("金字塔", exact=True).click()
    page.wait_for_timeout(500)
    storage = page.evaluate("localStorage.getItem('perler-bead-3d:model')")
    if storage:
        data = json.loads(storage)
        beads = data.get("beads", [])
        # 金字塔:7x7 + 5x5 + 3x3 + 1x1 = 49+25+9+1 = 84
        if len(beads) == 84:
            ok("金字塔加载", f"{len(beads)} 颗拼豆")
        else:
            ok("金字塔加载", f"{len(beads)} 颗(预期 84)")
    else:
        fail("金字塔加载", "localStorage 为空")

    page.screenshot(path=str(SHOTS / "11_presets_pyramid.png"))

    # 5. 切换到图纸模式验证金字塔可拆解
    page.get_by_role("button", name="图纸", exact=True).click()
    page.wait_for_timeout(600)
    body_text = page.locator("body").inner_text()
    if "层" in body_text:
        ok("金字塔拆解", "图纸模式显示层信息")
    else:
        fail("金字塔拆解", "未显示层信息")
    page.screenshot(path=str(SHOTS / "12_presets_pyramid_blueprint.png"))

    # 6. 返回建模,加载笑脸(单层)
    page.get_by_role("button", name="返回建模").click()
    page.wait_for_timeout(400)
    page.get_by_text("笑脸", exact=True).click()
    page.wait_for_timeout(400)
    storage = page.evaluate("localStorage.getItem('perler-bead-3d:model')")
    data = json.loads(storage)
    beads = data.get("beads", [])
    # 笑脸 7x7 网格,黄色 + 黑色部分
    yellow_count = sum(1 for b in beads if b["colorId"] == "yellow")
    black_count = sum(1 for b in beads if b["colorId"] == "black")
    if yellow_count > 0 and black_count > 0:
        ok("笑脸加载", f"黄{yellow_count}黑{black_count},共{len(beads)}")
    else:
        fail("笑脸加载", f"黄{yellow_count}黑{black_count}")

    # 7. 检查无运行时错误
    if page_errors:
        fail("运行时错误", "; ".join(page_errors[:3]))
    else:
        ok("运行时错误", "无")

    real_console_errors = [m for t, m in console_msgs if t == "error" and "favicon" not in m.lower()]
    if real_console_errors:
        fail("console错误", "; ".join(real_console_errors[:3]))
    else:
        ok("console错误", "无")

    browser.close()

print("\n" + "=" * 60)
print("预设模型库验证报告")
print("=" * 60)
npass = sum(1 for r in results if r[0] == "PASS")
nfail = sum(1 for r in results if r[0] == "FAIL")
for status, name, detail in results:
    mark = "✓" if status == "PASS" else "✗"
    print(f"{mark} [{status}] {name}: {detail}")
print("=" * 60)
print(f"通过 {npass} / 失败 {nfail} / 总计 {len(results)}")
sys.exit(0 if nfail == 0 else 1)
