<template>
	<div class="uni-list-item" @click="onClick">
		<div class="uni-list-item__container">
			<div v-if="thumb" class="uni-list-item__icon">
				<img :src="thumb" class="uni-list-item__icon-img" />
			</div>
			<div class="uni-list-item__content">
				<div class="uni-list-item__content-title">
					{{ listTitle }}
					<span class="uni-list-item__content-require" v-if="show">必填</span>
				</div>
				<div v-if="note" class="uni-list-item__content-note">{{ note }}</div>
			</div>
			<div class="uni-list-item__extra">
				<img class="icon_right" src="http://img.81lianpin.com/wechat_app/shanxi/right@2x.png" @change="onSwitchChange"/>
			</div>
		</div>
		<div v-if="base" class="uni-list-item__content-content">
			<div class="no-content" v-if="base.actualName == null || base.actualName == '' || base.actualName == undefined">尚未填写基本信息</div>
			<div v-else>
				<span>{{ base.actualName }}</span>
				<span>|{{ base.sexText }}</span>
				<span>|{{ base.age }}岁</span><br />
				<span>{{ base.nowAddressCity }}</span>
				<span>|{{ base.politicalTroubleText }}</span><br />
				<span>{{ base.serviceYears || '无服役年限' }}</span>
			</div>
		</div>
		<div v-if="tips" class="uni-list-item__content-content">
			<div class="no-content" v-if="tips.length<=0">尚未选择个人标签</div>
			<div class="tag-view" v-for="(item, index) in tips" :key="index" v-else>
				<van-tag round plain type="primary" :inverted="true" :circle="true">{{item.skillName}}</van-tag>
				<!-- <uni-tag :inverted="true" :circle="true" :text="item.skillName" type="primary" size="small" /> -->
			</div>
		</div>
		<div v-if="troopExperience" class="uni-list-item__content-content">
			<div class="no-content" v-if="troopExperience == 'no' || troopExperience == '' || troopExperience == undefined">尚未填写服役履历</div>
			<div class="troop-experience" v-else>{{ troopExperience }}</div>
		</div>
		<div v-if="intentionPage" class="uni-list-item__content-content">
			<div class="no-content" v-if="intentionPage.expectedPosition == null || intentionPage.expectedPosition == '' || intentionPage.expectedPosition == undefined">
				尚未填写求职意向
			</div>
			<div v-else>
				<span>
					期望行业:
					<span>{{ intentionPage.expectedPosition }}</span><br />
				</span>
				<span>
					期望城市:
					<span>{{ intentionPage.expectedCity }}</span><br />
				</span>
				<span>
					期望薪资:
					<span>{{ intentionPage.expectedSalaryMin }}-{{ intentionPage.expectedSalaryMax }}</span>
				</span>
			</div>
		</div>
		<div v-if="education" class="uni-list-item__content-content">
			<!-- <div class="troop-experience" v-for="(item, index) in education" :key="index"> -->
				<div class="no-content" v-if="education.schoolName == null || education.schoolName == '' || education.schoolName == undefined">尚未填写教育经历</div>
				<div v-else>
					<span class="left">{{ education.schoolName }}</span>
					<span class="right">{{ education.beginTime }}-{{ education.endTime }}</span>
					<div class="">
						<span style="display: inline-block;">{{ education.education }}</span>
						<span v-if="education.profession">|{{ education.profession }}</span>
					</div>
				</div>
			<!-- </div> -->
		</div>
		<div v-if="job" class="uni-list-item__content-content">
			<!-- <div class="troop-experience" v-for="(item, index) in job" :key="index"> -->
			<div class="no-content" v-if="job.companyName == null || job.companyName == '' || job.companyName == undefined">尚未填写工作经验</div>
			<div v-else="">
				<span class="left">{{ job.companyName }}</span>
				<span class="right">{{ job.startTime }}-{{ job.endTime }}</span>
				<div class="">
					<span style="display: inline-block;">{{ job.positionText }}</span>
				</div>
			</div>
				
			<!-- </div> -->
		</div>
	</div>
</template>

<script>
export default {
	components: {
		
	},
	props: {
		listTitle: {
			type: String,
			default: ''
		}, // 列表标题
		require: {
			type: Boolean,
			default: false
		}, // 是否必填
		note: {
			type: String,
			default: ''
		}, // 列表描述
		base: {
			type: Object,
			default() {}
		}, // 基本信息
		tips: {
			default:''
		}, // 个人标签
		troopExperience: {
			type: String,
			default: ''
		}, // 服役履历
		intentionPage: {
			type: Object,
			default() {}
		}, // 求职意向
		education: {
			type: Object,
			default() {}
		}, // 教育经历
		job: {
			type: Object,
			default() {}
		}, // 工作经历
		// disabled: {
		// 	// 是否禁用
		// 	type: Boolean,
		// 	default: false
		// },
		// showArrow: {
		// 	// 是否显示箭头
		// 	type: Boolean,
		// 	default: true
		// },
		// showBadge: {
		// 	// 是否显示数字角标
		// 	type: Boolean,
		// 	default: false
		// },
		// showSwitch: {
		// 	// 是否显示Switch
		// 	type: Boolean,
		// 	default: false
		// },
		// switchChecked: {
		// 	// Switch是否被选中
		// 	type: Boolean,
		// 	default: false
		// },
		badgeText: {
			type: [String, Number],
			default: ''
		}, // badge内容
		badgeType: {
			// badge类型
			type: String,
			default: 'success'
		},
		thumb: {
			type: String,
			default: ''
		}, // 缩略图
		// showExtraIcon: {
		// 	// 是否显示扩展图标
		// 	type: Boolean,
		// 	default: false
		// },
		// extraIcon: {
		// 	type: Object,
		// 	default() {
		// 		return {
		// 			type: 'contact',
		// 			color: '#000000',
		// 			size: 20
		// 		};
		// 	}
		// }
	},
	data() {
		return {
			show: false
		};
	},
	mounted(){
		this.show = this.require
	},
	methods: {
		onClick() {
			this.$emit('click');
		},
		onSwitchChange(e) {
			this.$emit('switchChange', e.detail);
		}
	}
};
</script>

<style scoped>
.icon_right{
	height: 22px;
	width: 15px;
}

.uni-list-item {
	font-size: 24px;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	background: #fff;
}

.uni-list-item--disabled {
	opacity: 0.3;
}

.uni-list-item--hover {
	background-color: #f1f1f1;
}

.uni-list-item__container {
	padding: 24px 24px;
	width: 100%;
	box-sizing: border-box;
	flex: 1;
	border-bottom: 1px solid #dcdcdc;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.uni-list-item__content-require {
	display: inline-block;
	color: #f13f3f;
	width: 66px;
	height: 29px;
	line-height: 29px;
	text-align: center;
	margin-left: 15px;
	border: 2px solid rgba(230, 0, 18, 1);
	border-radius: 10px;
}
.uni-list-item__container:after {
	position: absolute;
	z-index: 3;
	right: 0;
	bottom: 0;
	left: 30px;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.uni-list-item__content {
	flex: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.uni-list-item__content-title {
	font-size: 28px;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: inherit;
	line-height: 1.5;
	overflow: hidden;
}

.uni-list-item__content-note {
	color: #999;
	font-size: 28px;
	white-space: normal;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
}
.uni-list-item__content-content {
	width: 100%;
	box-sizing: border-box;
	color: #000;
	font-size: 26px;
	white-space: normal;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	overflow: hidden;
	padding-left: 24px;
	padding-bottom: 10px;
}
.uni-list-item__content-content .maxMask {
	position: relative;
	width: 100%;
}
.uni-list-item__content-content .right {
	position: absolute;
	right: 20px;
	display: inline-block;
}
.uni-list-item__content-content .troop-experience {
	color: #000;
	width: 100%;
	height: 100%;
	font-size: 24px;
	white-space: normal;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
}
.troop-experience .left {
	display: inline-block;
	width: 200px;
}
.uni-list-item__content-content text {
	margin: 5px;
	font-size: 24px;
}

.uni-list-item__icon {
	margin-right: 13px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.uni-list-item__icon-img {
	height: 35px;
}

.uni-list > .uni-list-item:last-child .uni-list-item-container:after {
	height: 0;
}
.tag-view {
	margin: 10px;
	display: inline-block;
}
.tag-view span{
	font-size: 25px;
}
.no-content {
	width: 750px;
	height: 200px;
	line-height: 200px;
	color: #ff0000;
	text-align: center;
}
</style>
