let prevText = ""
let lastToastTime = 0

function showToastWithCounts(totalLength, noSpaceLength) {
    const existing = document.getElementById("char-count-toast")
    if (existing) existing.remove()

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const backgroundColor = isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.95)"
    const textColor = isDark ? "#fff" : "#111"
    const shadowColor = isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.15)"

    const toast = document.createElement("div")
    toast.id = "char-count-toast"

    toast.innerHTML = `
      <div style="font-size: 14px; line-height: 1.6;">
        <div style="margin-bottom: 4px;">✍️ <strong>선택한 텍스트</strong></div>
        <div>총 글자 수: <strong>${totalLength}</strong></div>
        <div>공백 제외: <strong>${noSpaceLength}</strong></div>
      </div>
    `

    Object.assign(toast.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: backgroundColor,
        color: textColor,
        padding: "12px 16px",
        borderRadius: "10px",
        fontSize: "14px",
        zIndex: "999999",
        boxShadow: `0 4px 10px ${shadowColor}`,
        opacity: "0",
        transform: "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        maxWidth: "250px",
    })

    document.body.appendChild(toast)

    requestAnimationFrame(() => {
        toast.style.opacity = "1"
        toast.style.transform = "translateY(0)"
    })

    setTimeout(() => {
        toast.style.opacity = "0"
        toast.style.transform = "translateY(-10px)"
    }, 2000)

    setTimeout(() => {
        toast.remove()
    }, 2500)
}

function handleSelectionChangeDelayed() {
    // 타이밍 지연 후 selection 안정화
    setTimeout(() => {
        const text = window.getSelection().toString().trim()

        if (!text || text === prevText) return

        const now = Date.now()
        if (now - lastToastTime < 500) return

        prevText = text
        lastToastTime = now

        const totalLength = text.length
        const noSpaceLength = text.replace(/\s/g, "").length

        showToastWithCounts(totalLength, noSpaceLength)
    }, 50) // 충분한 지연시간 확보
}

// 마우스로 선택 시
document.addEventListener("mouseup", handleSelectionChangeDelayed)

// 키보드로 선택 시
document.addEventListener("keyup", handleSelectionChangeDelayed)
