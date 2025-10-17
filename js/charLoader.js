// /js/charLoader.js
async function loadCharacter(charFile) {
    try {
        const res = await fetch(`/data/characters/${charFile}`);
        const data = await res.json();
        const char = data[0];
        const talentData = data[1]?.talent;
        const skillData = data[2]?.skill;

        // Ảnh, tên, rarity, class
        if (char.image) document.getElementById('splash-art').src = char.image;
        if (char.name) document.getElementById('char-name').textContent = char.name;
        if (char.rarity) document.getElementById('char-rarity').src = char.rarity;
        if (char.class) document.getElementById('char-class').src = char.class;

        // Stats
        if (char.stats) {
            const s = char.stats;
            document.getElementById('atk').textContent = s.atk;
            document.getElementById('hp').textContent = s.hp;
            document.getElementById('def').textContent = s.def;
            document.getElementById('spd').textContent = s.spd;
            document.getElementById('crit').textContent = s.crit + "%";
            document.getElementById('critDmg').textContent = s.critDmg + "%";
            document.getElementById('res').textContent = s.res + "%";
            document.getElementById('accuracy').textContent = s.accuracy + "%";
            document.getElementById('mp').textContent = s.mp;
            document.getElementById('mpRegen').textContent = s.mpRegen + "%";
            document.getElementById('blight').textContent = s.blight;
            document.getElementById('overload').textContent = s.overload;
            document.getElementById('overloadRate').textContent = s.overloadRate + "%";
        }

        // Talent - Áp dụng định dạng chữ
        if (talentData) {
            for (let i = 1; i <= 5; i++) {
                const t = talentData[`talent${i}`];
                if (t) {
                    const imgEl = document.querySelector(`#talent${i} img`);
                    const nameEl = document.getElementById(`talent-name${i}`);
                    const descEl = document.getElementById(`talent-desc${i}`);

                    if (imgEl) imgEl.src = t[0];
                    if (nameEl) nameEl.textContent = t[1];
                    if (descEl) descEl.innerHTML = formatText(t[2]); // Sử dụng innerHTML và formatText
                }
            }
        }

        // Skill
        // Biến để lưu skill hiện tại đang được chọn
        let currentSkill = null;

        // Hàm cập nhật mô tả skill dựa trên level
        function updateSkillDescription(skill, level) {
            const skillNameEl = document.querySelector('.skill-name');
            const skillDescEl = document.querySelector('.skill-desc .desc');
            const skillIconEl = document.querySelector('.skill-desc .skill-icon');
            const skillAddEl = document.querySelector('.skill-add');

            // Cập nhật tên và icon - Định dạng "type: name"
            let displayName = skill.type || "Kỹ năng";
            if (skill.name) {
                displayName += ": " + skill.name;
            }
            skillNameEl.textContent = displayName;

            if (skill.link) skillIconEl.src = skill.link;

            // Xử lý mô tả chi tiết
            let details = skill.details;
            if (!details) {
                details = "Chưa có mô tả.";
            }

            // Nếu details là mảng, chúng ta xử lý từng phần tử
            if (Array.isArray(details)) {
                // Phần tử đầu tiên dùng cho mô tả chính
                let mainDesc = details[0];
                // Các phần tử còn lại dùng cho skill-add
                let additionalDesc = details.slice(1).join('<br><hr>');

                // Thay thế các placeholder trong mainDesc
                if (skill.statsTable) {
                    mainDesc = replacePlaceholders(mainDesc, skill.statsTable, level);
                }
                skillDescEl.innerHTML = formatText(mainDesc); // Áp dụng định dạng chữ

                // Xử lý skill-add
                if (additionalDesc) {
                    // Thay thế placeholder trong additionalDesc nếu có
                    if (skill.statsTable) {
                        additionalDesc = replacePlaceholders(additionalDesc, skill.statsTable, level);
                    }
                    skillAddEl.innerHTML = formatText(additionalDesc); // Áp dụng định dạng chữ
                    skillAddEl.style.display = 'block';
                } else {
                    skillAddEl.style.display = 'none';
                }
            } else {
                // details là string
                let mainDesc = details;
                if (skill.statsTable) {
                    mainDesc = replacePlaceholders(mainDesc, skill.statsTable, level);
                }
                skillDescEl.innerHTML = formatText(mainDesc); // Áp dụng định dạng chữ
                // Ẩn skill-add vì không có phần bổ sung
                skillAddEl.style.display = 'none';
            }
        }

        // Hàm thay thế các placeholder trong chuỗi với giá trị từ statsTable theo level
        function replacePlaceholders(desc, statsTable, level) {
            // Tìm tất cả các placeholder dạng <x>, <x1>, <x2>, ...
            const placeholderRegex = /<(\w+)>/g;
            return desc.replace(placeholderRegex, (match, key) => {
                // Nếu key tồn tại trong statsTable và mảng có phần tử tại index = level - 1
                if (statsTable[key] && statsTable[key][level - 1] !== undefined) {
                    return statsTable[key][level - 1];
                }
                // Nếu không tìm thấy, trả về placeholder gốc
                return match;
            });
        }

        // Tạo list skill buttons
        if (skillData) {
            const skillContainer = document.querySelector('.skill-container .skill-list');
            skillContainer.innerHTML = ''; // Xóa mẫu cũ

            const slider = document.querySelector('.skill-container .level-slider');
            const lvValue = document.querySelector('.skill-container .lv-value');

            // Lắng nghe sự kiện thay đổi slider
            slider.addEventListener('input', (e) => {
                const level = parseInt(e.target.value);
                lvValue.textContent = level;
                if (currentSkill) {
                    updateSkillDescription(currentSkill, level);
                }
            });

            Object.entries(skillData).forEach(([key, skill]) => {
                const btn = document.createElement('button');
                btn.classList.add('img-btn');

                const img = document.createElement('img');
                img.classList.add('skill-icon');
                img.src = skill.link || '/image/menu/page_icon.png';
                img.alt = key;
                btn.appendChild(img);

                // Khi click vào kỹ năng
                btn.addEventListener('click', () => {
                    // Cập nhật skill hiện tại
                    currentSkill = skill;

                    // Thiết lập slider
                    // Xác định level tối đa cho skill này: lấy độ dài của bất kỳ mảng nào trong statsTable (nếu có)
                    let maxLevel = 1;
                    if (skill.statsTable && Object.keys(skill.statsTable).length > 0) {
                        // Lấy mảng đầu tiên trong statsTable để xác định độ dài
                        const firstKey = Object.keys(skill.statsTable)[0];
                        maxLevel = skill.statsTable[firstKey].length;
                    }
                    slider.max = maxLevel;
                    slider.value = 1;
                    lvValue.textContent = 1;

                    // Cập nhật mô tả skill với level 1
                    updateSkillDescription(skill, 1);
                });

                skillContainer.appendChild(btn);
            });

            // Hiển thị mặc định kỹ năng đầu tiên
            const firstSkillKey = Object.keys(skillData)[0];
            if (firstSkillKey) {
                const firstSkill = skillData[firstSkillKey];
                currentSkill = firstSkill;

                // Thiết lập slider cho skill đầu tiên
                let maxLevel = 1;
                if (firstSkill.statsTable && Object.keys(firstSkill.statsTable).length > 0) {
                    const firstKey = Object.keys(firstSkill.statsTable)[0];
                    maxLevel = firstSkill.statsTable[firstKey].length;
                }
                slider.max = maxLevel;
                slider.value = 1;
                lvValue.textContent = 1;

                updateSkillDescription(firstSkill, 1);
            }
        }
        if (onComplete) onComplete();
    } catch (err) {
        console.error("Không thể tải dữ liệu nhân vật:", err);
    }
}

// Hàm định dạng văn bản - chỉ sử dụng in đậm với cú pháp <<...>>
function formatText(text) {
    if (!text || typeof text !== 'string') return text;

    // Chỉ xử lý in đậm: <<nội dung>>
    let result = text;
    result = result.replace(/<<(.*?)>>/g, '<b>$1</b>');

    return result;
}