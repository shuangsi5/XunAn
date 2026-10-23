-- ============================================================
-- 汛安智慧防汛应急救援系统 - 数据库初始化脚本
-- 数据库名: xunan
-- 字符集: utf8mb4
-- ============================================================

USE xunan;

-- ----------------------------
-- 1. 用户表
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号，登录账号',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `password` VARCHAR(100) NOT NULL COMMENT '密码',
  `unit` VARCHAR(100) DEFAULT '' COMMENT '单位/组织',
  `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用: 1启用 0禁用',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ----------------------------
-- 2. 用户角色关联表
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `role_code` VARCHAR(30) NOT NULL COMMENT '角色编码: admin-管理员, rescuer-救援人员, user-普通用户',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`, `role_code`),
  KEY `idx_role` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- ----------------------------
-- 3. 救援人员信息表
-- ----------------------------
DROP TABLE IF EXISTS `rescuer_info`;
CREATE TABLE `rescuer_info` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL COMMENT '关联用户ID',
  `status` VARCHAR(20) NOT NULL DEFAULT '空闲' COMMENT '状态: 空闲/任务中',
  `latitude` DECIMAL(10, 8) NOT NULL DEFAULT 0 COMMENT '纬度',
  `longitude` DECIMAL(11, 8) NOT NULL DEFAULT 0 COMMENT '经度',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='救援人员实时信息表';

-- ----------------------------
-- 4. SOS 求救记录表
-- ----------------------------
DROP TABLE IF EXISTS `sos_records`;
CREATE TABLE `sos_records` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '发布用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '联系人姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '联系人电话',
  `latitude` DECIMAL(10, 8) NOT NULL DEFAULT 0 COMMENT '纬度',
  `longitude` DECIMAL(11, 8) NOT NULL DEFAULT 0 COMMENT '经度',
  `address` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '地址',
  `description` TEXT COMMENT '情况描述',
  `emergency_level` VARCHAR(20) NOT NULL DEFAULT '一般' COMMENT '紧急程度: 一般/紧急/特急',
  `emergency_category` VARCHAR(50) NOT NULL DEFAULT '受困' COMMENT '险情类别',
  `status` VARCHAR(20) NOT NULL DEFAULT '待救援' COMMENT '状态: 待救援/救援中/已完成',
  `assigned_rescuer_id` INT UNSIGNED DEFAULT NULL COMMENT '指派救援人员ID',
  `notes` TEXT COMMENT '备注',
  `image_url` VARCHAR(500) DEFAULT NULL COMMENT '现场照片URL',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SOS求救记录表';

-- ----------------------------
-- 5. 救援任务记录表
-- ----------------------------
DROP TABLE IF EXISTS `rescue_tasks`;
CREATE TABLE `rescue_tasks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sos_id` INT UNSIGNED NOT NULL COMMENT '关联SOS记录ID',
  `rescuer_id` INT UNSIGNED NOT NULL COMMENT '指派救援人员ID',
  `assign_time` DATETIME NOT NULL COMMENT '指派时间',
  `complete_time` DATETIME DEFAULT NULL COMMENT '完成时间',
  `task_status` VARCHAR(20) NOT NULL DEFAULT '进行中' COMMENT '任务状态: 进行中/已完成',
  PRIMARY KEY (`id`),
  KEY `idx_sos_id` (`sos_id`),
  KEY `idx_rescuer_id` (`rescuer_id`),
  KEY `idx_task_status` (`task_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='救援任务记录表';

-- ============================================================
-- 初始数据
-- ============================================================

-- 插入默认管理员用户（id=1，作为匿名SOS的默认关联用户）
INSERT INTO `users` (`phone`, `name`, `password`, `unit`, `is_active`) VALUES
('13800138000', '系统管理员', 'admin123', '汛安指挥中心', 1);

-- 给管理员分配角色
INSERT INTO `user_roles` (`user_id`, `role_code`) VALUES
(1, 'command');

-- 插入示例救援人员用户
INSERT INTO `users` (`phone`, `name`, `password`, `unit`, `is_active`) VALUES
('13900139000', '张救援', '123456', '蓝天救援队', 1),
('13900139001', '李救援', '123456', '红十字会救援队', 1),
('13900139002', '王救援', '123456', '消防中队', 1);

-- 给示例用户分配救援人员角色
INSERT INTO `user_roles` (`user_id`, `role_code`) VALUES
(2, 'rescuer'),
(3, 'rescuer'),
(4, 'rescuer');

-- 初始化救援人员信息
INSERT INTO `rescuer_info` (`user_id`, `status`, `latitude`, `longitude`) VALUES
(2, '空闲', 30.25000000, 120.16000000),
(3, '空闲', 30.26000000, 120.17000000),
(4, '空闲', 30.24000000, 120.15000000);

-- 插入示例 SOS 记录
INSERT INTO `sos_records` (`user_id`, `name`, `phone`, `latitude`, `longitude`, `address`, `description`, `emergency_level`, `emergency_category`, `status`, `notes`) VALUES
(1, '王小明', '13700137000', 30.25100000, 120.16100000, '杭州市西湖区某路段', '路段积水严重，车辆被困', '紧急', '内涝', '待救援', '请携带救生衣'),
(1, '李小红', '13700137001', 30.25200000, 120.16200000, '杭州市余杭区某小区', '地下室进水，人员被困', '特急', '受困', '待救援', '有老人小孩'),
(1, '张大伟', '13700137002', 30.25300000, 120.16300000, '杭州市滨江区某工地', '工地塌方，有人员受伤', '紧急', '塌方', '已完成', '已安全转移');
