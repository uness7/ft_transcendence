<template>
	<div class="content">
		<h1>{{$t('privacy.title')}}</h1>
		<p class="date">{{$t('privacy.effective_date')}}</p>

		<h2>1. {{$t('privacy.introduction.title')}}</h2>
		<p>
			{{$t('privacy.introduction.text')}}
		</p>

		<h2>2. {{$t('privacy.data_we_collect.title')}}</h2>
		<p>
			{{$t('privacy.data_we_collect.text')}}
		</p>

		<h2>3. {{$t('privacy.how_we_use_your_data.title')}}</h2>
		<p>
			{{$t('privacy.how_we_use_your_data.text')}}
		</p>

		<h2>4. {{$t('privacy.legal_basis_for_processing.title')}}</h2>
		<p>
			{{$t('privacy.legal_basis_for_processing.text')}}
		</p>

		<h2>5. {{$t('privacy.data_sharing.title')}}</h2>
		<p>
			{{$t('privacy.data_sharing.text')}}
		</p>

		<h2>6. {{$t('privacy.data_security.title')}}</h2>
		<p>
			{{$t('privacy.data_security.text')}}
		</p>

		<h2>7. {{$t('privacy.data_retention.title')}}</h2>
		<p>
			{{$t('privacy.data_retention.text')}}
		</p>

		<h2>8. {{$t('privacy.your_rights.title')}}</h2>
		<p>
			{{$t('privacy.your_rights.text')}}
		</p>

		<h2>9. {{$t('privacy.cookies.title')}}</h2>
		<p>
			{{$t('privacy.cookies.text')}}
		</p>

		<h2>10. {{$t('privacy.children_privacy.title')}}</h2>
		<p>
			{{$t('privacy.children_privacy.text')}}
		</p>

		<h2>11. {{$t('privacy.data_transfers.title')}}</h2>
		<p>
			{{$t('privacy.data_transfers.text')}}
		</p>

		<h2>12. {{$t('privacy.changes_to_policy.title')}}</h2>
		<p>
			{{$t('privacy.changes_to_policy.text')}}
		</p>

		<h2>13. {{$t('privacy.contact_us.title')}}</h2>
		<p>
			{{$t('privacy.contact_us.text')}}
		</p>
	</div>
</template>

<style scoped>
.content {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	background-color: var(--background-color);
	border-radius: 5px;
}

h1 {
	color: white;
	margin-top: 82px;
	font-size: 2rem;
	border-bottom: 1px solid #ddd;
	padding-bottom: 10px;
}

.date {
	color: rgb(200,200,200);
	font-size: 0.9rem;
	margin-bottom: 20px;
	display: block;
}

h2 {
	color: rgb(200,200,200);
	font-size: 1.4rem;
	margin-top: 20px;
}

p {
	color: rgb(230,230,230);
	line-height: 1.6;
	font-size: 1rem;
	margin-top: 10px;
}

@media (max-width: 768px) {
	.content {
		padding: 10px;
	}

	h1 {
		font-size: 1.8rem;
	}

	h2 {
		font-size: 1.2rem;
	}

	p {
		font-size: 0.9rem;
	}
}
</style>
