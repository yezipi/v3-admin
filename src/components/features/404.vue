<template>
  <div id="da-wrapper" class="fluid">
    <div id="da-content">
      <div class="da-container clearfix">
        <div id="da-error-wrapper">
          <div id="da-error-pin"></div>
          <div id="da-error-code">
            <span>404</span>
          </div>
          <h1 class="da-error-heading">页面不见了</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts"></script>

<style lang="less">
.admin-content .admin-main {
  height: 100%;
  padding: 0;
}
</style>


<style scoped lang="less">
div#da-wrapper,
div#da-wrapper.fluid {
  width: 100%;
}
div#da-wrapper {
  background-image: url('@/assets/img/blueprint.png');
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
div#da-content {
  clear: both;
  padding-bottom: 58px;
}
div#da-wrapper .da-container,
div#da-wrapper.fluid .da-container {
  width: 96%;
  margin: auto;
}
div#da-error-wrapper {
  width: 320px;
  padding: 30px 0;
  margin: auto;
  position: relative;
}
div#da-error-wrapper #da-error-pin {
  width: 38px;
  height: 38px;
  display: block;
  margin: auto;
  margin-bottom: -27px;
  z-index: 10;
  position: relative;
  background: url("@/assets/img/error-pin.png") no-repeat center center;
}
div#da-error-wrapper #da-error-code {
  width: 317px;
  height: 297px;
  position: relative;
  margin: auto;
  margin-bottom: 20px;
  z-index: 5;
  line-height: 1;
  font-size: 32px;
  text-align: center;
  background: url("@/assets/img/error-hanger.png") no-repeat center center;
  background-size: 100% 100%;
  -webkit-transform-origin: center top;
  -moz-transform-origin: center top;
  transform-origin: center top;
  -webkit-animation: error-swing infinite 1.4s ease-in-out alternate;
  -moz-animation: error-swing infinite 1.4s ease-in-out alternate;
  animation: error-swing infinite 1.4s ease-in-out alternate;
  overflow: hidden;
}
#da-error-code span {
  display: inline-block;
  margin-top: 140px;
}
div#da-error-wrapper .da-error-heading {
  color: #e15656;
  text-align: center;
  font-size: 24px;
}
div#da-error-wrapper p {
  text-align: center;
  font-size: 14px;
  margin-bottom: 20px;
}
div#da-error-wrapper #da-error-code span {
  font-size: 96px;
  display: block;
}
@keyframes error-swing {
  0% {
    -webkit-transform: rotate(3deg);
  }
  100% {
    -webkit-transform: rotate(-4deg);
  }
}
</style>